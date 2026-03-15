import { useParams } from "react-router-dom";

function SpellDetailPage() {
  const { index } = useParams();
  return (
    <div>
      <h2>Spell Details</h2>
      <p>Details for spell: {index}</p>
    </div>
  );
}

export default SpellDetailPage;
