import { useEffect, useRef, useState } from 'react'
import masterBarberImage from '../assets/barber/master-sharli.jpeg'
import './MasterBarberSection.css'

const signatureDetails = [
    {
        label: '01 / Consultation',
        value: 'Shape the look',
        text: 'Face shape, hair flow, beard line, and daily routine are checked before the first cut.'
    },
    {
        label: '02 / Cut + Detail',
        value: 'Build the finish',
        text: 'Controlled fades, scissor work, razor lines, and beard balance are refined in layers.'
    },
    {
        label: '03 / Final Ritual',
        value: 'Leave sharp',
        text: 'Hot towel, product finish, mirror check, and aftercare advice complete the appointment.'
    }
]

function MasterBarberSection() {
    const sectionRef = useRef(null)
    const threeSceneRef = useRef(null)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const section = sectionRef.current

        if (!section) {
            return undefined
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                    observer.unobserve(entry.target)
                }
            },
            {
                threshold: 0.28,
                rootMargin: '0px 0px -12% 0px'
            }
        )

        observer.observe(section)

        return () => {
            observer.disconnect()
        }
    }, [])

    useEffect(() => {
        const mount = threeSceneRef.current

        if (!mount || !isVisible) {
            return undefined
        }

        let animationFrameId
        let renderer
        let scene
        let camera
        let stage
        let resizeObserver
        let noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        const pointer = { x: 0, y: 0 }
        const cleanupTasks = []

        const initThreeScene = async () => {
            const THREE = await import('../vendor/three.module.js')

            scene = new THREE.Scene()
            camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100)
            camera.position.set(0, 0.35, 8.4)

            renderer = new THREE.WebGLRenderer({
                alpha: true,
                antialias: true,
                preserveDrawingBuffer: true,
                powerPreference: 'high-performance'
            })
            renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75))
            renderer.setClearColor(0x000000, 0)
            renderer.domElement.setAttribute('role', 'img')
            renderer.domElement.setAttribute(
                'aria-label',
                'Decorative 3D barber scene with floating gold blades, rings, and depth particles.'
            )
            mount.appendChild(renderer.domElement)

            stage = new THREE.Group()
            stage.rotation.set(-0.14, -0.18, 0.04)
            scene.add(stage)

            const gold = new THREE.MeshStandardMaterial({
                color: 0xd6a64f,
                metalness: 0.92,
                roughness: 0.26,
                emissive: 0x3a2408,
                emissiveIntensity: 0.22
            })
            const darkGold = new THREE.MeshStandardMaterial({
                color: 0x8b5a22,
                metalness: 0.88,
                roughness: 0.34,
                emissive: 0x1a0e02,
                emissiveIntensity: 0.16
            })
            const glass = new THREE.MeshPhysicalMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.13,
                roughness: 0.18,
                metalness: 0.18,
                transmission: 0.35,
                thickness: 0.6
            })

            const bladeGeometry = new THREE.BoxGeometry(0.08, 2.9, 0.08)
            const shortBladeGeometry = new THREE.BoxGeometry(0.06, 1.7, 0.06)
            const ringGeometry = new THREE.TorusGeometry(1.9, 0.012, 12, 120)
            const beadGeometry = new THREE.SphereGeometry(0.025, 12, 12)

            const ringOne = new THREE.Mesh(ringGeometry, glass)
            ringOne.scale.set(1.32, 1.32, 1.32)
            ringOne.rotation.set(1.2, 0.3, 0.18)
            stage.add(ringOne)

            const ringTwo = new THREE.Mesh(ringGeometry, darkGold)
            ringTwo.scale.set(0.86, 0.86, 0.86)
            ringTwo.rotation.set(1.34, -0.42, -0.28)
            stage.add(ringTwo)

            const blades = []
            for (let index = 0; index < 11; index += 1) {
                const angle = (index / 11) * Math.PI * 2
                const radius = index % 2 === 0 ? 2.6 : 3.25
                const blade = new THREE.Mesh(index % 3 === 0 ? shortBladeGeometry : bladeGeometry, index % 2 === 0 ? gold : darkGold)
                blade.position.set(Math.cos(angle) * radius, Math.sin(angle * 1.4) * 0.9, Math.sin(angle) * 1.65)
                blade.rotation.set(angle * 0.35, angle + Math.PI / 2, 0.55)
                blade.userData = {
                    angle,
                    radius,
                    speed: 0.32 + index * 0.018,
                    lift: 0.2 + (index % 4) * 0.08
                }
                blades.push(blade)
                stage.add(blade)
            }

            const particles = new THREE.Group()
            for (let index = 0; index < 58; index += 1) {
                const bead = new THREE.Mesh(beadGeometry, index % 3 === 0 ? gold : glass)
                const angle = (index / 58) * Math.PI * 2
                const radius = 1.4 + (index % 9) * 0.28
                bead.position.set(
                    Math.cos(angle) * radius,
                    ((index % 13) - 6) * 0.18,
                    Math.sin(angle) * radius * 0.36
                )
                bead.userData = { angle, radius }
                particles.add(bead)
            }
            stage.add(particles)

            scene.add(new THREE.AmbientLight(0xf8dfb5, 0.68))
            const keyLight = new THREE.PointLight(0xf3c472, 26, 14)
            keyLight.position.set(-2.8, 3.1, 4.2)
            scene.add(keyLight)
            const rimLight = new THREE.PointLight(0xffffff, 9, 12)
            rimLight.position.set(3.6, -1.4, 5)
            scene.add(rimLight)

            const resize = () => {
                const width = mount.clientWidth || 1
                const height = mount.clientHeight || 1
                camera.aspect = width / height
                camera.updateProjectionMatrix()
                renderer.setSize(width, height, false)
            }

            resizeObserver = new ResizeObserver(resize)
            resizeObserver.observe(mount)
            resize()

            const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
            const handleMotionChange = (event) => {
                noMotion = event.matches
            }
            motionQuery.addEventListener('change', handleMotionChange)
            cleanupTasks.push(() => motionQuery.removeEventListener('change', handleMotionChange))

            const pointerTarget = sectionRef.current || mount
            const handlePointerMove = (event) => {
                const rect = pointerTarget.getBoundingClientRect()
                pointer.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2
                pointer.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2
            }
            pointerTarget.addEventListener('pointermove', handlePointerMove)
            cleanupTasks.push(() => pointerTarget.removeEventListener('pointermove', handlePointerMove))

            const clock = new THREE.Clock()
            const render = () => {
                const elapsed = clock.getElapsedTime()
                const delta = clock.getDelta()

                if (!noMotion) {
                    stage.rotation.y += delta * 0.09
                    stage.rotation.x = -0.14 + pointer.y * 0.05
                    stage.position.x += (pointer.x * 0.16 - stage.position.x) * 0.045
                    ringOne.rotation.z += delta * 0.12
                    ringTwo.rotation.z -= delta * 0.18
                    particles.rotation.y += delta * 0.05

                    blades.forEach((blade) => {
                        blade.position.y += Math.sin(elapsed * blade.userData.speed + blade.userData.angle) * blade.userData.lift * 0.004
                        blade.rotation.z += delta * 0.1
                    })
                }

                renderer.render(scene, camera)
                animationFrameId = window.requestAnimationFrame(render)
            }

            render()
        }

        initThreeScene()

        return () => {
            window.cancelAnimationFrame(animationFrameId)
            cleanupTasks.forEach((cleanup) => cleanup())
            resizeObserver?.disconnect()
            renderer?.dispose()

            if (renderer?.domElement?.parentNode) {
                renderer.domElement.parentNode.removeChild(renderer.domElement)
            }
        }
    }, [isVisible])

    return (
        <section
            ref={sectionRef}
            className={`masterBarberSection ${isVisible ? 'masterBarberVisible' : ''}`}
            id="master-barber"
            aria-labelledby="master-barber-title"
        >
            <div className="masterThreeScene" ref={threeSceneRef} />
            <div className="masterBarberInner">
                <div className="masterBarberImageWrap">
                    <div className="imageGlow" aria-hidden="true" />
                    <div className="portraitFrame" aria-hidden="true" />

                    <img
                        src={masterBarberImage}
                        alt="Master Sharli standing inside the barber shop"
                        className="masterBarberImage"
                        loading="lazy"
                        decoding="async"
                    />

                    <div className="experienceBadge">
                        <strong>10+</strong>
                        <span>Years of craft</span>
                    </div>


                </div>

                <div className="masterBarberContent">
                    <div className="masterKicker">
                        <span />
                        <p className="miniLabel">Meet the master</p>
                    </div>

                    <h2 id="master-barber-title">
                        Crafted by <br />
                        Master Sharli
                    </h2>

                    <p className="masterIntro">
                        A premium grooming session built around precision, calm confidence,
                        and a finish that looks sharp after you leave the chair. Every cut
                        starts with a real consultation and ends with clean detailing.
                    </p>

                    <div className="masterHighlights" aria-label="Master Sharli highlights">
                        <div>
                            <span>10+</span>
                            <strong>Years refining classic cuts and modern fades</strong>
                        </div>
                        <div>
                            <span>1:1</span>
                            <strong>Personal appointment rhythm from consult to finish</strong>
                        </div>
                    </div>

                    <div className="masterStats">
                        {signatureDetails.map((detail) => (
                            <article key={detail.label}>
                                <small>{detail.label}</small>
                                <strong>{detail.value}</strong>
                                <span>{detail.text}</span>
                            </article>
                        ))}
                    </div>

                    <div className="masterActions">
                        <a className="goldBtn masterButton" href="#booking" aria-label="Book with Master Sharli">
                            Book with Master Sharli <b>&rarr;</b>
                        </a>

                        <a className="masterTextLink" href="#services">
                            View services <span>&rarr;</span>
                        </a>
                    </div>

                    <div className="masterSeal" aria-hidden="true">
                        Signature grooming / Master Sharli / Since 2014
                    </div>
                </div>
            </div>
        </section>
    )
}

export default MasterBarberSection
