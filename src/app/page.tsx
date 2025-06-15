//there is not "us client" which make the page.tsx a server component
//
//"use server"  allows a functon that is defined on the server to be used in the client
//
//cause this is a server component every child that i has that is not expicitly said to be a client component will become a server component

export default async function HomePage() {
  return <div>Home page</div>

}

