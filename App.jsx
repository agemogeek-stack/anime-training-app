import React, { useState, useEffect } from "react";

// Anime Training App – Solo Leveling Style import { useEffect } from "react";

export default function AnimeTrainingApp() { const [workouts, setWorkouts] = useState(() => { const saved = localStorage.getItem("workouts"); return saved ? JSON.parse(saved) : [ { name: "Flexões", reps: 100, done: 0 }, { name: "Agachamentos", reps: 100, done: 0 }, { name: "Abdominais", reps: 100, done: 0 }, { name: "Punhos da Fé", reps: 1000, done: 0 } ]; });

const [log, setLog] = useState([]);

// Cronômetro de descanso (1 minuto) const [timeLeft, setTimeLeft] = useState(60); const [timerActive, setTimerActive] = useState(false);

useEffect(() => { if (!timerActive) return; if (timeLeft === 0) { setTimerActive(false); setTimeLeft(60); return; } const interval = setInterval(() => { setTimeLeft(t => t - 1); }, 1000); return () => clearInterval(interval); }, [timerActive, timeLeft]);(() => { const saved = localStorage.getItem("log"); return saved ? JSON.parse(saved) : []; });

const [playerXP, setPlayerXP] = useState(() => { return Number(localStorage.getItem("xp")) || 0; });

const [newExercise, setNewExercise] = useState({ name: "", reps: 0 });

useEffect(() => { localStorage.setItem("workouts", JSON.stringify(workouts)); localStorage.setItem("log", JSON.stringify(log)); localStorage.setItem("xp", playerXP); }, [workouts, log, playerXP]);

const addRep = (index) => { const updated = [...workouts]; if (updated[index].done < updated[index].reps) { updated[index].done += 1; setWorkouts(updated); } };

const resetDay = () => { setLog([ ...log, { date: new Date().toLocaleDateString(), completed: workouts.every(w => w.done === w.reps) } ]);

const completedExercises = workouts.filter(w => w.done === w.reps).length;
setPlayerXP(playerXP + completedExercises * 50);

setWorkouts(workouts.map(w => ({ ...w, done: 0 })));

};

const addExercise = () => { if (!newExercise.name || newExercise.reps <= 0) return; setWorkouts([ ...workouts, { name: newExercise.name, reps: newExercise.reps, done: 0 } ]); setNewExercise({ name: "", reps: 0 }); };

const removeExercise = (index) => { setWorkouts(workouts.filter((_, i) => i !== index)); };

const rank = playerXP < 500 ? "E" : playerXP < 1500 ? "D" : playerXP < 3000 ? "C" : playerXP < 5000 ? "B" : "A";

return ( <div className="min-h-screen bg-black text-blue-400 p-4 font-sans"> <h1 className="text-3xl font-bold text-center mb-2">Anime Training</h1> <p className="text-center text-sm mb-6">Rank do Caçador: <span className="text-blue-500 font-bold">{rank}</span> | XP: {playerXP}</p>

<div className="grid gap-4">
    {workouts.map((w, i) => (
      <div key={i} className="bg-gray-900 rounded-2xl p-4 shadow-lg">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">{w.name}</h2>
          <button onClick={() => removeExercise(i)} className="text-red-500">✖</button>
        </div>
        <p className="text-sm mb-2">{w.done} / {w.reps}</p>
        <button
          onClick={() => {
              addRep(i);
              setTimerActive(true);
            }}
          className="bg-blue-600 text-black px-4 py-2 rounded-xl hover:bg-blue-500"
        >
          +1 Repetição
          { /* Ao clicar, inicia o descanso */ }
        </button>
      </div>
    ))}
  </div>

  <div className="bg-gray-900 p-4 rounded-2xl mt-6">
    <h2 className="text-lg font-bold mb-2">Adicionar Exercício</h2>
    <input
      className="w-full mb-2 p-2 rounded bg-black text-blue-400"
      placeholder="Nome do exercício"
      value={newExercise.name}
      onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
    />
    <input
      type="number"
      className="w-full mb-2 p-2 rounded bg-black text-blue-400"
      placeholder="Repetições"
      value={newExercise.reps}
      onChange={(e) => setNewExercise({ ...newExercise, reps: Number(e.target.value) })}
    />
    <button onClick={addExercise} className="w-full bg-blue-700 py-2 rounded-xl">Adicionar</button>
  </div>

  <div className="mt-6 bg-gray-900 rounded-2xl p-4 text-center">
    <p className="text-lg font-semibold">Descanso</p>
    <p className="text-3xl font-bold text-blue-400">{timeLeft}s</p>
  </div>

  <button
    onClick={resetDay}
    className="mt-6 w-full bg-blue-800 text-white py-3 rounded-2xl"
  >
    Finalizar Dia
  </button>

  <div className="mt-8">
    <h2 className="text-2xl font-bold mb-2">Diário</h2>
    {log.map((entry, i) => (
      <div key={i} className="text-sm mb-1">
        <p>{entry.date} {entry.completed ? "✔️" : "❌"}</p>
      </div>
    ))}
  </div>
</div>

); }
