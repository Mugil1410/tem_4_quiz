function createElement(type, parent) {
    var element = document.createElementNS("http://www.w3.org/2000/svg", type);
    if (parent) parent.appendChild(element);
    return element;
}

function setArc(element, x, y, radius, startAngle, offset) {
    offset = Math.PI * 2.0001 - (offset % (Math.PI * 2));

    var d = [
        "M",
        x + Math.cos(startAngle) * radius,
        y + Math.sin(startAngle) * radius,
        "A",
        radius,
        radius,
        0,
        offset % (Math.PI * 2) > Math.PI ? 0 : 1,
        0,
        x + Math.cos(startAngle + offset) * radius,
        y + Math.sin(startAngle + offset) * radius,
        "L",
        x,
        y,
        "Z"
    ].join(" ");

    element.setAttribute("d", d);
}

function Wheel(entries, colorScheme) {

    this.entries = entries;
    this.colorScheme = colorScheme;
    this.size = 400;
    this.isSpinning = false;
    this.friction = 8;
    this.angle = Math.PI / entries.length;
    this.angularVelocity = 0;
    this.dt = 1 / 60;

    this.svg = createElement("svg", document.querySelector("#wheelContainer"));
    this.svg.setAttribute("viewBox", `0 0 ${this.size} ${this.size}`);
    this.svg.setAttribute("width", "100%");
    this.svg.setAttribute("height", "100%");

    this.group = createElement("g", this.svg);
    this.group.style.transformOrigin = "center";

    for (var i = 0; i < entries.length; i++) {
        var arc = createElement("path", this.group);
        arc.setAttribute("fill", colorScheme[i]);

        var radius = this.size * 0.47;
        var angle = (-i / entries.length) * Math.PI * 2;
        var offset = (Math.PI * 2) / entries.length;

        setArc(arc, this.size / 2, this.size / 2, radius, angle, offset);

        var text = createElement("text", this.group);
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("alignment-baseline", "middle");

        text.style.transform =
            `translate(${this.size / 2}px, ${this.size / 2}px)
             rotate(${angle - offset / 2 + Math.PI}rad)
             translateX(${-radius * 0.75}px)`;

        text.textContent = entries[i];
    }

    var arrow = createElement("path", this.svg);
    arrow.setAttribute("fill", "white");
    arrow.setAttribute(
        "d",
        [
            "M", this.size / 2, this.size * 0.05,
            "L", this.size * 0.46, 0,
            "L", this.size * 0.54, 0,
            "Z"
        ].join(" ")
    );

    this.spin = function () {
        if (!this.isSpinning) {
            this.isSpinning = true;
            this.angularVelocity = 18;
            return true;
        }
        return false;
    };

    this.update = function () {
        if (this.isSpinning) {
            this.angularVelocity -=
                Math.min(Math.abs(this.angularVelocity) / this.dt, this.friction) *
                Math.sign(this.angularVelocity) *
                this.dt;

            this.angle += this.angularVelocity * this.dt;

            if (Math.abs(this.angularVelocity) < 0.2) {
                this.isSpinning = false;
                if (this.spinDone) this.spinDone();
            }
        }

        this.group.style.transform =
            `rotate(${this.angle - Math.PI / 2}rad)`;
    };

    this.getCurrentEntry = function () {
        return this.entries[
            Math.floor(
                ((this.angle % (Math.PI * 2)) /
                    (Math.PI * 2)) *
                    this.entries.length
            )
        ];
    };

    this.spinDone = function () {};
}