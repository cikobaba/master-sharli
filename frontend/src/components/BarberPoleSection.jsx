import { useEffect, useRef } from 'react'
import './BarberPoleSection.css'

function BarberPoleSection() {
    const sectionRef = useRef(null)

    useEffect(() => {
        const section = sectionRef.current

        const handleScroll = () => {
            if (!section) return

            const rect = section.getBoundingClientRect()
            const windowHeight = window.innerHeight

            const progress = (windowHeight - rect.top) / (windowHeight + rect.height)
            const clampedProgress = Math.max(0, Math.min(progress, 1))

            section.style.setProperty('--scroll-progress', clampedProgress)
        }

        handleScroll()

        window.addEventListener('scroll', handleScroll, { passive: true })

        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])

    return (
        <section className="barberPoleSection" ref={sectionRef}>
            <div className="poleMarquee poleMarqueeTop">
                <div>
                    <span>Master Sharli Barber Experience</span>
                    <span>Master Sharli Barber Experience</span>
                </div>
            </div>

            <div className="poleMarquee poleMarqueeBottom">
                <div>
                    <span>Precision. Style. Ritual.</span>
                    <span>Precision. Style. Ritual.</span>
                </div>
            </div>

            <div className="poleContent">
                <div className="poleText">
                    <p className="miniLabel">Signature detail</p>
                    <h2>The classic barber pole, reimagined in motion.</h2>
                    <p>
                        A glowing symbol of grooming tradition, brought into a modern
                        premium barbershop experience.
                    </p>

                    <a className="goldBtn poleButton" href="#booking">
                        Book Appointment <b>→</b>
                    </a>
                </div>

                <div className="poleStage">
                    <div className="barberPole">
                        <div className="poleCap poleCapTop" />
                        <div className="poleCap poleCapBottom" />
                        <div className="poleGlass" />
                        <div className="poleLight" />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default BarberPoleSection