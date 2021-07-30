export function encode(str) {
    return typeof str === 'string'
        ? str
            .replace(/&(?!\w+;)/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;')
            .replace(/`/g, '&grave;')
        : str;
}
export function decode(str) {
    return typeof str === 'string'
        ? str
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&apos;/g, "'")
            .replace(/&grave;/g, '`')
        : str;
}
export default {
    encode,
    decode
};
