export async function delay(amount: number) {
	await new Promise((res) => setTimeout(res, amount));
}
