'use client';

import { Player } from '@/types/core/player';

type LeftPanelProps = {
  players: Player[];
  onAddToQueue: (player: Player) => void;
  onDraftClick: (player: Player) => void;
  isUserTurn: boolean;
};

const LeftPanel = ({
  players,
  onAddToQueue,
  onDraftClick,
  isUserTurn,
}: LeftPanelProps) => {
  return (
    <div className="relative flex flex-col h-full w-full overflow-visible bg-[rgba(28,29,46,0.58)] rounded-md">
      <div className="overflow-y-auto h-full w-full border-r border-slate-800 rounded-md">
        <table className="w-full text-xs text-white">
          <thead className="sticky top-0 z-20">
            <tr>
              <th className="text-left px-3 py-2">DRAFT</th>
              <th className="text-left px-0 py-2">RANK</th>
              <th className="text-left px-1 py-1">ADP</th>
              <th className="text-left px-2 py-1">NAME</th>
              <th className="text-left px-2 py-1">POS</th>
              <th className="text-left px-2 py-1">TEAM</th>
              <th className="text-left px-2 py-1">ADD</th>
            </tr>
          </thead>
          <tbody>
            {players.map((p, index) => (
              <tr
                key={`${p.full_name}-${p.team}`}
                className={`border-b border-slate-700 hover:bg-slate-800 ${
                  index % 2 === 0
                    ? 'bg-[rgba(28,29,46,0.23)]'
                    : 'bg-[rgba(28,29,46,0.05)]'
                }`}
              >
                <td className="px-2 py-0">
                  <button
                    disabled={!isUserTurn}
                    onClick={() => isUserTurn && onDraftClick(p)}
                    className={`text-[9px] font-bold px-2 py-0.5 rounded transition ${
                      isUserTurn
                        ? 'bg-[#181c28] hover:bg-[#617fb9] text-[#ff2600] cursor-pointer'
                        : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    DRAFT
                  </button>
                </td>
                <td className="px-2 py-1.5 text-slate-300">{p.rank}</td>
                <td className="px-2 py-1.5 text-slate-300">{p.adp}</td>
                <td className="px-2 py-1.5 text-slate-300">{p.full_name}</td>
                <td className="px-2 py-1.5 text-slate-300">{p.position}</td>
                <td className="px-2 py-1.5 text-slate-300">{p.team}</td>
                <td className="px-4 py-1">
                  <button
                    className="text-green-400 hover:text-green-300 font-bold"
                    onClick={() => onAddToQueue(p)}
                    aria-label={`Add ${p.full_name} to queue`}
                  >
                    +
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeftPanel;
