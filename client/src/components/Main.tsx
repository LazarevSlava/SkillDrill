import RegisterForm from './RegisterForm';

export default function Main() {
  const handleServer = () => {
    fetch('http://localhost:3001/api/hello', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: 'Slava' }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.message);
      });
  };
  return (
    <main className="flex-grow overflow-auto py-10 px-6">
      <h2 className="text-3xl font-bold mb-4">Welcome to SkillDrill</h2>
      <p className="text-gray-700 dark:text-gray-300">
        Here will be an interactiv platform
      </p>
      <button
        onClick={handleServer}
        className="px-6 py-2 bg-red-600 text-white font-semibold rounded hover:bg-blue-700 transition"
      >
        Click me
      </button>
      <RegisterForm />
    </main>
  );
}
