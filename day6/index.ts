export function findMarkerStart(signal: string, charsNumber: number) {
  const charList = signal.split('');

  for (let i = 0; i <= charList.length - charsNumber; i++) {
    const subList = charList.slice(i, i + charsNumber);
    const uniqueSubList = Array.from(new Set(subList));

    if (uniqueSubList.length === subList.length) {
      return i + charsNumber;
    }
  }
}
