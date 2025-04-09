import Link from "next/link";


export default function Navbar() {
    return (
        <nav className="bg-blue-200 p-4 flex justify-between items-center shadow-lg">
            <Link href="/" className="text-white text-2xl font-bold">
                <img src="https://www.freepnglogos.com/uploads/hotel-logo-png/hotel-icon-download-28.png" alt="logo" className="w-24" />
            </Link>
        </nav>
    )
}