export function scrollToDiv(e: Event, goTo: string) {
	e.stopPropagation();
	if (!goTo) return;
	const targetDiv = document.getElementById(goTo);
	if (targetDiv) {
		const targetPosition = targetDiv.getBoundingClientRect().top + window.scrollY;
		const offsetPosition = targetPosition - 50;
		window.scrollTo({
			top: offsetPosition,
			behavior: 'smooth'
		});
	}
}

export function onClickReadMore(e: Event, goTo: string) {
	scrollToDiv(e, goTo);
}
