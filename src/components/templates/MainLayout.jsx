import Navbar from '../organisms/Navbar.jsx'
import Footer from '../organisms/Footer.jsx'

function MainLayout({ children }) {
    return (
        <>
            <Navbar />
            <main>{children}</main>
            <Footer />
        </>
    )
}

export default MainLayout
