import { useEffect, useState } from "react";
import { useUser } from "../user-context";

const ratings = [
    { value: 0, emoji: "😭" },
    { value: 1, emoji: "😕" },
    { value: 2, emoji: "🙂" },
    { value: 3, emoji: "🤩" },
]

function ChapterFeedback({ chapter }: { chapter: string }) {
    const { user } = useUser();
    const [rating, setRating] = useState<number | undefined>(undefined);
    const [anonymous, setAnonymous] = useState<boolean>(false);
    const [feedback, setFeedback] = useState<string>("");
    const [feedbackStatus, setFeedbackStatus] = useState<"unsent" | "sending" | "sent">("unsent")
    function handleRatingClick(v: number) {
        setRating(o => o === v ? undefined : v);
    }
    useEffect(() => {
        return () => {
            fetch("https://account.lingdocs.com/feedback", {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ feedback: "", rating }),
            }).catch(() => {
                console.error("couldn't send chapter feedback");
            });
        }   
    }, []);
    function handleSendFeedback() {
        const toSend = {
            chapter,
            feedback,
            rating,
            anonymous,
        };
        setFeedbackStatus("sending");
        fetch("https://account.lingdocs.com/feedback", {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(toSend),
        }).then(res => res.json()).then(res => {
            if (res.ok) {
                setFeedbackStatus("sent");
            } else {
                setFeedbackStatus("unsent");
                alert("error sending feedback");
            }
        }).catch(() => {
            setFeedbackStatus("unsent");
            alert("connect to the internet to send feedback");
        });
    }
    if (feedbackStatus === "sent") {
        return <div>
            <hr/>
            <div className="d-flex flex-row justify-content-center align-items-center" style={{ height: "6rem" }}>
                <div className="lead">Thanks for your feedback!</div>
            </div>
        </div>
    }
    return <div>
        <hr />
        <div>
            <div className="text-center">Was this chapter helpful?</div>
            <div className="d-flex flex-row align-items-center justify-content-center">
                {ratings.map(({ value, emoji }) => (
                    <div
                        key={value}
                        className="mx-2 clickable"
                        style={rating !== value
                            ? {
                                filter: "grayscale(100%)",
                                fontSize: "2.25rem",
                            }  : { fontSize: "2.75rem" }}
                        onClick={() => handleRatingClick(value)}
                    >
                        {emoji}
                    </div>
                ))}
            </div>
            {rating !== undefined && <div style={{ maxWidth: "30rem", margin: "0 auto" }}>
                <div className="form-group">
                    <label htmlFor="feedbackText" className="text-left">Feedback:</label>
                    <textarea
                        className="form-control"
                        id="feedbackText"
                        rows={3}
                        value={feedback}
                        onChange={e => setFeedback(e.target.value)}
                    />
                </div>
                <div className="d-flex flex-row justify-content-between align-items-center">
                    <div className="small">
                        {(user && !anonymous)
                            ? `Feedback will be sent as ${user.name}`
                            : `Feedback will be anonymous`}
                    </div>
                    <div className="d-flex flex-row">
                        {feedbackStatus === "sending" && <div className="mr-3">
                            <samp>sending...</samp>
                        </div>}
                        <div>
                            <button className="btn btn-sm btn-primary" onClick={handleSendFeedback}>Send</button>
                        </div>
                    </div>
                </div>
                {user && <div className="form-check small">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        checked={anonymous}
                        onChange={e => setAnonymous(e.target.checked)}
                        id="anonymounCheck"
                    />
                    <label className="form-check-label" htmlFor="anonymousCheck">
                        keep feedback anonymouns
                    </label>
                </div>}
            </div>}
        </div>
    </div>;
}



export default ChapterFeedback;