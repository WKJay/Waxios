export function assert(exp, msg = "assert fail") {
    if (!exp) {
        throw new Error(msg)
    }
};