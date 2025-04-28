import Link from "next/link";


export default function Navbar() {
    return (
        <nav className="bg-[#0b2816] flex justify-center items-center shadow-lg">
            <Link href="/" className="text-white text-2xl font-bold">
                <img src="https://res.cloudinary.com/upwork-cloud/image/upload/c_scale,w_1000/v1687682186/catalog/1672883559033151488/koqih8uinv9ubojggzwu.jpg" alt="logo" className="w-60" />
            </Link>
        </nav>
    )
}