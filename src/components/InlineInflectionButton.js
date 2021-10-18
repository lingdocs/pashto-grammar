import buttonUnpressed from "../images/button-unpressed.png";
import buttonHalfPressed from "../images/button-half-pressed.png";
import buttonFullyPressed from "../images/button-fully-pressed.png";

function InlineInflectionButton({ inflection }) {
    return (
        <img
            src={inflection === 2 ? buttonFullyPressed
                : inflection === 1 ? buttonHalfPressed
                : buttonUnpressed}
            style={{ maxWidth: "2rem" }}
            alt={inflection === 2 ? "button fully pressed"
                : inflection === 1 ? "button halp pressed"
                : "button unpressed"}
            className="mx-1"
        />
    );
}

export default InlineInflectionButton;
