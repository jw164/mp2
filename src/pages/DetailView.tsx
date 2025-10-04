import { useParams, Link } from "react-router-dom";

export default function DetailView() {
  const { id } = useParams(); // will be undefined on "/" route, defined on "/pokemon/:id"
  return (
    <main>
      <h1>Pokémon Detail {id}</h1>
      <p>The Pokémon details will be displayed here later.</p>
      <Link to="/">Back to List</Link>
    </main>
  );
}
