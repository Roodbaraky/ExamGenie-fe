export const dateFormatter = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = today.getMonth() + 1;
    const dd = today.getDate();

    const ddString = dd < 10 ? '0' + dd : dd
    const mmString = mm < 10 ? '0' + mm : mm

    const formattedToday = ddString + '/' + mmString + '/' + yyyy;
    return formattedToday
}