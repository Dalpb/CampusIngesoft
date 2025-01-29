import { useState,useEffect  } from 'react'
export function useResponseLayout(){
    const [isNavCollapsed, setIsNavCollapsed] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 768)
        }

        checkIfMobile()
        window.addEventListener('resize', checkIfMobile)

        return () => {
            window.removeEventListener('resize', checkIfMobile)
        }
    }, [])
    const toggleNav = () => {
        setIsNavCollapsed(!isNavCollapsed)
    }

    return {isNavCollapsed,isMobile,toggleNav};
}