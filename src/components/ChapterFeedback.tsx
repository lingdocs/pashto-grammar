import { useEffect, useState } from "react";

const ratings = [
    { value: 0, emoji: "😭" },
    { value: 1, emoji: "😕" },
    { value: 2, emoji: "🙂" },
    { value: 3, emoji: "🤩" },
]

function ChapterFeedback({ chapter }: { chapter: string }) {
    const [rating, setRating] = useState<number | undefined>(undefined);
    const [feedback, setFeedback] = useState<string>("");
    const [feedbackSent, setFeedbackSent] = useState<boolean>(false);
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
            })
        }   
    });
    function handleSendFeedback() {
        const toSend = {
            chapter,
            feedback,
            rating,
        };
        fetch("https://account.lingdocs.com/feedback", {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(toSend),
        }).then(res => res.json()).then(res => {
            console.log(res);
            if (res.ok) {
                setFeedbackSent(true);
            } else {
                alert("error sending feedback");
            }
        }).catch(() => {
            alert("connect to the internet to send feedback");
            setFeedbackSent(true);
        });
    }
    if (feedbackSent) {
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
                    <label htmlFor="exampleFormControlTextarea1" className="text-left">Feedback:</label>
                    <textarea
                        className="form-control"
                        id="exampleFormControlTextarea1"
                        rows={3}
                        value={feedback}
                        onChange={e => setFeedback(e.target.value)}
                    />
                </div>
                <div className="text-right">
                    <button className="btn btn-sm btn-primary" onClick={handleSendFeedback}>Send</button>
                </div>
            </div>}
        </div>
    </div>;
}



export default ChapterFeedback;