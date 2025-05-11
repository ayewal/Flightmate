import { useState, useEffect } from "react";
import "./App.css";

const CITY_OPTIONS = [
  { name: "Denver", value: "Denver" },
  { name: "Phoenix", value: "Phoenix" },
  { name: "Chicago", value: "Chicago" },
  { name: "Las Vegas", value: "Las Vegas" },
  { name: "Dallas", value: "Dallas" },
  { name: "San Diego", value: "San Diego" },
  { name: "Orlando", value: "Orlando" },
  // Add more cities as needed
];

const API_KEY = "50939903f4d4920e67508b7a44dd4324";

const DEFAULT_TASKS = [
  "Preflight brief with gate agent",
  "Preflight brief with captain",
  "Stow luggage",
  "Conduct security search",
  "Check equipment",
  "Login to Order Up",
  "Check and secure galley",
];

function App() {
  const [selectedCity, setSelectedCity] = useState("");
  const [temperatureMessage, setTemperatureMessage] = useState("");

  const [position, setPosition] = useState("A");
  const [tasks, setTasks] = useState(
    DEFAULT_TASKS.map((text, index) => ({
      id: index + 1,
      text,
      completed: false,
    }))
  );
  const [newTask, setNewTask] = useState("");

  const fetchWeather = async (city) => {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${API_KEY}`
    );
    const data = await response.json();
    const temp = data.main.temp;

    if (temp < 60) {
      setTemperatureMessage(
        `Grab your jacket! It's currently ${temp}°F in ${city}.`
      );
    } else {
      setTemperatureMessage(
        `It's warm outside in ${city} (${temp}°F) — enjoy your day!`
      );
    }
  };

  const handleAdd = () => {
    if (!newTask.trim()) return;
    const task = {
      id: Date.now(),
      text: newTask,
      completed: false,
    };
    setTasks([...tasks, task]);
    setNewTask("");
  };

  const handleToggle = (id) => {
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handlePositionChange = (e) => {
    setPosition(e.target.value);
    setTasks(
      DEFAULT_TASKS.map((text, index) => ({
        id: index + 1,
        text,
        completed: false,
      }))
    );
  };

  return (
    <div className="app">
      <h1>FlightMate: Task Tracker</h1>
      <div className="position-select">
        <label>Select Crew Position:</label>
        <select value={position} onChange={handlePositionChange}>
          <option value="A">Position A</option>
          <option value="B">Position B</option>
          <option value="C">Position C</option>
          <option value="D">Position D</option>
        </select>
      </div>
      <div className="input-section">
        <input
          type="text"
          placeholder="Add custom task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button onClick={handleAdd}>Add Task</button>
      </div>
      <ul className="task-list">
        {tasks.map((task) => (
          <li
            key={task.id}
            className={`task ${task.completed ? "completed" : ""}`}
            onClick={() => handleToggle(task.id)}
          >
            {task.text}
          </li>
        ))}
      </ul>
      <div className="weather-box">
        <label>Check weather in destination:</label>
        <select
          value={selectedCity}
          onChange={(e) => {
            const city = e.target.value;
            setSelectedCity(city);
            fetchWeather(city);
          }}
        >
          <option value="">Select a city</option>
          {CITY_OPTIONS.map((city) => (
            <option key={city.value} value={city.value}>
              {city.name}
            </option>
          ))}
        </select>

        {temperatureMessage && (
          <p className="weather-message">{temperatureMessage}</p>
        )}
      </div>
      ;
    </div>
  );
}

export default App;
