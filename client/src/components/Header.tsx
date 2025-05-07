export default function Header() {
    return (
        <header className="bg-gray-800 text-white py-4 px-6 shadow-md">
            <div className="flex justify-detween items-centr">
                <h1 className="text-xl font-bold">SkillDrill</h1>
                <nav>
                    <ul className="flex gap-4">
                        <li>
                            <a href="#" className="hover:underline"></a>Home
                        </li>
                        <li>
                            <a href="#" className="hover:underline"></a>About
                        </li>
                        <li>
                            <a href="#" className="hover:underline"></a>Contact
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}
