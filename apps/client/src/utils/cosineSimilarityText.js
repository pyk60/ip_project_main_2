export const cosineSimilarityText = (textA, textB) => {
    if (!textA || !textB) return 0;

    const tokenize = (text) =>
        text
            .toLowerCase()
            .replace(/[^\w\s]/g, "") // 특수 문자 제거
            .split(/\s+/); // 공백 기준으로 토큰화

    const tokensA = tokenize(textA);
    const tokensB = tokenize(textB);

    const setA = new Set(tokensA);
    const setB = new Set(tokensB);

    const intersection = [...setA].filter((token) => setB.has(token)).length;
    const magnitudeA = Math.sqrt(tokensA.length);
    const magnitudeB = Math.sqrt(tokensB.length);

    return magnitudeA && magnitudeB ? intersection / (magnitudeA * magnitudeB) : 0;
};
