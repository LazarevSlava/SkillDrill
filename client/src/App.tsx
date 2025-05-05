import './App.css';

function App() {
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
        console.log('git testt');
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-800">
            <div className="bg-white dark:bg-gray-900 shadow-md rounded-xl p-8 text-center">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                    Hello Tailwind!
                </h1>
                <button
                    onClick={handleServer}
                    className="px-6 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition"
                >
                    Click me
                </button>
            </div>
        </div>
    );
}

export default App;
