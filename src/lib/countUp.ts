// One frame of the metric count-up: k runs 0..1, prefix/suffix, decimals and commas are kept.
export function countFrame(target: string, k: number): string {
  const m = target.match(/^(<?)([\d,.]+)(.*)$/);
  if (!m) return target;
  const [, pre, num, post] = m;
  const end = parseFloat(num.replace(/,/g, "")), dec = (num.split(".")[1] || "").length;
  let s = (end * (1 - Math.pow(1 - k, 3))).toFixed(dec);
  if (num.includes(",")) s = Number(s).toLocaleString("en-US", { minimumFractionDigits: dec });
  return pre + s + post;
}
