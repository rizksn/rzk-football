'use client';
import { useEffect, useState } from 'react';
import { Player } from "@/types";

export default function ADPTable() {
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    const fetchADP = async () => {
      const res = await fetch('/adp-draftsharks.json');
      const json = await res.json();
      setPlayers(json.data); 
    };

    fetchADP();
  }, []);

  return (
    <div className="flex-1 overflow-y-auto p-2">
      <table className="w-full table-auto border-collapse text-sm text-left text-green-400">
        <thead className="bg-slate-800 sticky top-0 z-10 text-green-400">
          <tr>
            <th className="px-2 py-1">ADP</th>
            <th className="px-2 py-1">Name</th>
            <th className="px-2 py-1">Pos</th>
            <th className="px-2 py-1">Team</th>
          </tr>
        </thead>
        <tbody>
          {players.map((p) => (
            <tr key={`${p.name}-${p.team}`} className="border-b border-slate-700 hover:bg-slate-800">
              <td className="px-2 py-1 text-green-400">{p.adp.toFixed(1)}</td>
              <td className="px-2 py-1">{p.name}</td>
              <td className="px-2 py-1">{p.position}</td>
              <td className="px-2 py-1">{p.team}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
