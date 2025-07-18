export default function HomeLayout(props: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col  bg-gradient-to-br from-black via-neutral-900 to-neutral-800 text-white">
      <main className="text-center">{props.children}</main>
    </div>
  );
}
