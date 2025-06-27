"use client"
import React, { useCallback, useMemo, useState } from "react";
import { createEditor, Descendant } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import mammoth from "mammoth";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { DB_FileType, DB_FolderType } from "~/server/db/schema";



export default function ClaudeContents(props: {
	files: DB_FileType[];
	folders: DB_FolderType[];
	parents: DB_FolderType[];
	currentFolderId: number;
}) {
	const editor = useMemo(() => withReact(createEditor()), []);
	const [value, setValue] = useState<Descendant[]>([
		{
			type: "paragraph",
			children: [{ text: "Select a document to edit or upload a new .docx file." }],
		},
	]);
	const [selectedFile, setSelectedFile] = useState<DB_FileType | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	// Filter .docx files
	const docxFiles = useMemo(() =>
		props.files.filter(file => file.name.toLowerCase().endsWith('.docx')),
		[props.files]
	);

	// Build breadcrumb path
	const breadcrumbPath = useMemo(() => {
		const path = [...props.parents].reverse();
		return path;
	}, [props.parents]);

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		setIsLoading(true);
		try {
			const arrayBuffer = await file.arrayBuffer();
			const result = await mammoth.extractRawText({ arrayBuffer });

			// Split by lines and map to Slate nodes
			const lines = result.value.split("\n").filter(line => line.trim() !== "");
			const slateContent: Descendant[] = lines.length > 0
				? lines.map((line) => ({
					type: "paragraph",
					children: [{ text: line }],
				}))
				: [{
					type: "paragraph",
					children: [{ text: "" }],
				}];

			setValue(slateContent);
			setSelectedFile(null); // Clear selected file when uploading new one
		} catch (error) {
			alert("Failed to load .docx file");
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleFileSelect = async (file: DB_FileType) => {
		setIsLoading(true);
		setSelectedFile(file);

		try {
			// Fetch the file from the URL
			const response = await fetch(file.url);
			if (!response.ok) throw new Error('Failed to fetch file');

			const arrayBuffer = await response.arrayBuffer();
			const result = await mammoth.extractRawText({ arrayBuffer });

			const lines = result.value.split("\n").filter(line => line.trim() !== "");
			const slateContent: Descendant[] = lines.length > 0
				? lines.map((line) => ({
					type: "paragraph",
					children: [{ text: line }],
				}))
				: [{
					type: "paragraph",
					children: [{ text: "" }],
				}];

			setValue(slateContent);
		} catch (error) {
			alert(`Failed to load ${file.name}`);
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	// Save handler - export JSON content
	const handleSaveJSON = () => {
		const json = JSON.stringify(value, null, 2);
		const blob = new Blob([json], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `${selectedFile?.name.replace('.docx', '') || 'document'}.json`;
		a.click();
		URL.revokeObjectURL(url);
	};

	// Save handler - export plain text
	const handleSaveText = () => {
		const plainText = value
			.map(node =>
				Array.isArray(node.children)
					? node.children.map(c => c.text).join("")
					: ""
			)
			.join("\n");

		const blob = new Blob([plainText], { type: 'text/plain' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `${selectedFile?.name.replace('.docx', '') || 'document'}.txt`;
		a.click();
		URL.revokeObjectURL(url);
	};

	const renderLeaf = useCallback(({ attributes, children, leaf }: any) => {
		if (leaf.bold) children = <strong>{children}</strong>;
		if (leaf.italic) children = <em>{children}</em>;
		return <span {...attributes}>{children}</span>;
	}, []);

	const formatFileSize = (bytes: number) => {
		if (bytes === 0) return '0 Bytes';
		const k = 1024;
		const sizes = ['Bytes', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
	};

	return (
		<div className="max-w-6xl mx-auto p-6 space-y-6">
			{/* Breadcrumb Navigation */}
			{breadcrumbPath.length > 0 && (
				<div className="flex items-center space-x-2 text-sm text-gray-600">
					<span>Path:</span>
					{breadcrumbPath.map((folder, index) => (
						<React.Fragment key={folder.id}>
							<span>{folder.name}</span>
							{index < breadcrumbPath.length - 1 && <span>/</span>}
						</React.Fragment>
					))}
				</div>
			)}

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* File Browser Sidebar */}
				<Card className="p-4 space-y-4">
					<h2 className="text-lg font-semibold">Documents ({docxFiles.length})</h2>

					{/* Upload New File */}
					<div className="space-y-2">
						<label className="text-sm font-medium">Upload New Document:</label>
						<input
							type="file"
							accept=".docx"
							onChange={handleFileChange}
							disabled={isLoading}
							className="w-full text-sm"
						/>
					</div>

					{/* File List */}
					<div className="space-y-2 max-h-96 overflow-y-auto">
						{docxFiles.length === 0 ? (
							<p className="text-gray-500 text-sm">No .docx files found</p>
						) : (
							docxFiles.map((file) => (
								<button
									key={file.id}
									onClick={() => handleFileSelect(file)}
									disabled={isLoading}
									className={`w-full text-left p-3 rounded-md border transition-colors ${selectedFile?.id === file.id
										? 'bg-blue-50 border-blue-300'
										: 'bg-white border-gray-200 hover:bg-gray-50'
										} ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
								>
									<div className="font-medium text-sm truncate">{file.name}</div>
									<div className="text-xs text-gray-500">
										{formatFileSize(file.size)} • {new Date(file.createdAt).toLocaleDateString()}
									</div>
								</button>
							))
						)}
					</div>

					{/* Folder List */}
					{folders.length > 0 && (
						<div className="space-y-2">
							<h3 className="text-sm font-medium text-gray-700">Folders:</h3>
							{folders.map((folder) => (
								<div key={folder.id} className="p-2 bg-gray-50 rounded text-sm">
									📁 {folder.name}
								</div>
							))}
						</div>
					)}
				</Card>

				{/* Document Editor */}
				<Card className="lg:col-span-2 p-6 space-y-4">
					<div className="flex items-center justify-between">
						<h1 className="text-2xl font-semibold">Document Editor</h1>
						{isLoading && <span className="text-sm text-gray-500">Loading...</span>}
					</div>

					{selectedFile && (
						<div className="text-sm text-gray-600 bg-blue-50 p-2 rounded">
							Editing: <strong>{selectedFile.name}</strong>
						</div>
					)}

					<Slate editor={editor} value={value} onChange={setValue}>
						<Editable
							className="min-h-[400px] p-4 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="Document content will appear here..."
							renderLeaf={renderLeaf}
							spellCheck
							autoFocus
							readOnly={isLoading}
						/>
					</Slate>

					<div className="flex space-x-2">
						<Button
							onClick={handleSaveJSON}
							variant="default"
							disabled={isLoading}
						>
							Export JSON
						</Button>
						<Button
							onClick={handleSaveText}
							variant="outline"
							disabled={isLoading}
						>
							Export Text
						</Button>
					</div>
				</Card>
			</div>
		</div>
	);
}



