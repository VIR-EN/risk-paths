"use client"

import { useState } from "react"
import Image from "next/image"

type Stage = 1 | 2 | 3

export default function Home() {
    const [step, setStep] = useState<Stage>(1)
    const [result, setResult] = useState<any>(null)

    async function vote(stage: string, choice: string) {
        try {
            const res = await fetch("/api/vote", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ stage, choice })
            })

            if (!res.ok) {
                console.error("Vote failed", await res.text())
                return
            }

            const data = await res.json()
            setResult(data)
            setStep((s) => (s < 3 ? ((s + 1) as Stage) : s))
        } catch (err) {
            console.error("Vote error:", err)
        }
    }


    // choose image based on stage
    const imageSrc =
        step === 1
            ? "/paths/path_base.png"
            : step === 2
                ? "/paths/paths_plus13.png"
                : "/paths/paths_plus25.png"

    return (
        <main
            style={{
                minHeight: "100vh",
                background: "#0b0b0b",
                color: "#f2f2f2",
                display: "flex",
                justifyContent: "center",
                padding: "40px 20px"
            }}
        >
            <div style={{ maxWidth: 760, width: "100%" }}>
                {/* ---------------- Title & intro ---------------- */}
                <h1
                    style={{
                        fontSize: 28,
                        fontWeight: 500,
                        marginBottom: 12
                    }}
                >
                    Same Returns. Different Paths.
                </h1>

                <p
                    style={{
                        opacity: 0.75,
                        marginBottom: 24,
                        lineHeight: 1.5
                    }}
                >
                    Two portfolios start at the same value and span the same time period.
                    The difference lies in how the journey unfolds.
                </p>

                {/* ---------------- Image ---------------- */}
                <div style={{ marginBottom: 28 }}>
                    <Image
                        src={imageSrc}
                        alt="Two portfolios with the same start and end value but different paths"
                        width={760}
                        height={420}
                        priority
                    />
                    <p
                        style={{
                            marginTop: 8,
                            fontSize: 12,
                            opacity: 0.55,
                            fontStyle: "italic"
                        }}
                    >
                        Illustrative example constructed to make differences in risk visible.
                        Real portfolios are noisier and harder to distinguish.
                    </p>
                </div>

                {/* ---------------- STEP 1 ---------------- */}
                {step === 1 && (
                    <>
                        <p style={{ marginBottom: 12 }}>
                            Which would you rather hold?
                        </p>

                        <div style={{ display: "flex", gap: 14 }}>
                            <Button onClick={() => vote("stage1", "A")}>
                                Portfolio A
                            </Button>
                            <Button onClick={() => vote("stage1", "B")}>
                                Portfolio B
                            </Button>
                        </div>
                    </>
                )}

                {/* ---------------- STEP 2 ---------------- */}
                {step === 2 && (
                    <>
                        <p style={{ marginBottom: 12 }}>
                            If Portfolio B ended with a <b>13% higher</b> final value,
                            would you switch?
                        </p>

                        <div style={{ display: "flex", gap: 14 }}>
                            <Button onClick={() => vote("stage2", "yes")}>Yes</Button>
                            <Button onClick={() => vote("stage2", "no")}>No</Button>
                        </div>
                    </>
                )}

                {/* ---------------- STEP 3 ---------------- */}
                {step === 3 && (
                    <>
                        <p style={{ marginBottom: 12 }}>
                            If Portfolio B ended with a <b>25% higher</b> final value,
                            would you switch?
                        </p>

                        <div style={{ display: "flex", gap: 14 }}>
                            <Button onClick={() => vote("stage3", "yes")}>Yes</Button>
                            <Button onClick={() => vote("stage3", "no")}>No</Button>
                        </div>

                        {/* aggregate result */}
                        {result && (
                            <p
                                style={{
                                    marginTop: 18,
                                    fontStyle: "italic",
                                    opacity: 0.85
                                }}
                            >
                                {Math.round(
                                    (result.yes / (result.yes + result.no)) * 100
                                )}
                                % of participants switched at this level.
                            </p>
                        )}

                        <p
                            style={{
                                marginTop: 28,
                                opacity: 0.6,
                                fontSize: 14
                            }}
                        >
                            Different people draw this line in different places.
                        </p>

                        {/* ---------------- Explanation (revealed AFTER choices) ---------------- */}
                        {result && (
                            <div
                                style={{
                                    marginTop: 40,
                                    paddingTop: 24,
                                    borderTop: "1px solid #222",
                                    fontSize: 14,
                                    lineHeight: 1.6,
                                    opacity: 0.85
                                }}
                            >
                                <h3
                                    style={{
                                        fontSize: 16,
                                        fontWeight: 500,
                                        marginBottom: 8
                                    }}
                                >
                                    What were the returns, actually?
                                </h3>

                                <p>
                                    All portfolios start with ₹10,000 and span the same 10-year
                                    period.
                                </p>

                                <p>
                                    Portfolio A (and the base version of Portfolio B) end at
                                    approximately ₹36,000 — equivalent to about <b>13.8% CAGR</b>.
                                </p>

                                <p>
                                    In the counterfactual scenarios:
                                </p>

                                <ul style={{ marginLeft: 18, marginTop: 10 }}>
                                    <li>
                                        Portfolio B ending 13% higher corresponds to roughly{" "}
                                        <b>15.3% CAGR</b>
                                    </li>
                                    <li>
                                        Portfolio B ending 25% higher corresponds to roughly{" "}
                                        <b>16.4% CAGR</b>
                                    </li>
                                </ul>
                                <p style={{ marginTop: 24 }}>
                                    You weren’t asked to calculate risk here.
                                    You were asked to sit with it.
                                </p>

                                <p>
                                    The hesitation or discomfort you felt wasn’t abstract — it was part of the
                                    investment experience itself.
                                </p>


                                <p>
                                    The headline numbers are close.
                                    The experience of holding them is not.
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </main>
    )
}

/* ---------------- Reusable Button ---------------- */

function Button({
                    children,
                    onClick
                }: {
    children: React.ReactNode
    onClick: () => void
}) {
    return (
        <button
            onClick={onClick}
            style={{
                padding: "10px 18px",
                background: "transparent",
                color: "#f2f2f2",
                border: "1px solid #666",
                borderRadius: 4,
                cursor: "pointer",
                fontSize: 14
            }}
            onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = "#aaa")
            }
            onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = "#666")
            }
        >
            {children}
        </button>
    )
}
