export async function delay(amount: number): Promise<void> {
	return await new Promise((res) => setTimeout(res, amount));
}
