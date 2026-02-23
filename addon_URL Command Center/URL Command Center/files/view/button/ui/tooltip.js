
window.Tooltip = {};

Tooltip.el = document.createElement("div");
Tooltip.el.className = "url-tooltip";
document.body.appendChild(Tooltip.el);

Tooltip.show = (text, x, y) => {
	Tooltip.el.textContent = text;
	Tooltip.el.style.opacity = 1;
	Tooltip.move(x, y);
};

Tooltip.move = (x, y) => {
	Tooltip.el.style.left = x + 10 + "px";
	Tooltip.el.style.top = y + 10 + "px";
};

Tooltip.hide = () => {
	Tooltip.el.style.opacity = 0;
};