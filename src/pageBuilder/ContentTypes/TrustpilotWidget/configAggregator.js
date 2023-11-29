export default node => {
    const trustpilotId = node.querySelector("[data-element='trustpilot']").textContent;

    return {
        trustpilotId
    };
};
