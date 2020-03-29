import { Helpers } from 'bnc-onboard/dist/src/interfaces'

const Logo = `
<svg
        xmlns:dc="http://purl.org/dc/elements/1.1/"
        xmlns:cc="http://creativecommons.org/ns#"
        xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
        xmlns:svg="http://www.w3.org/2000/svg"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
        xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
        version="1.1"
        id="图层_1"
        x="0px"
        y="0px"
        viewBox="0 0 769.56256 772.01001"
        xml:space="preserve"
        sodipodi:docname="imToken-onlyLogo_noMargin.svg"
        width="769.56256"
        height="772.01001"
        inkscape:version="0.92.4 5da689c313, 2019-01-14"><metadata
   id="metadata18"><rdf:RDF><cc:Work
       rdf:about=""><dc:format>image/svg+xml</dc:format><dc:type
        rdf:resource="http://purl.org/dc/dcmitype/StillImage" /><dc:title></dc:title></cc:Work></rdf:RDF></metadata><defs
        id="defs16" /><sodipodi:namedview
        pagecolor="#ffffff"
        bordercolor="#666666"
        borderopacity="1"
        objecttolerance="10"
        gridtolerance="10"
        guidetolerance="10"
        inkscape:pageopacity="0"
        inkscape:pageshadow="2"
        inkscape:window-width="1839"
        inkscape:window-height="1125"
        id="namedview14"
        showgrid="false"
        inkscape:zoom="0.30729167"
        inkscape:cx="445.85836"
        inkscape:cy="390.87393"
        inkscape:window-x="1872"
        inkscape:window-y="467"
        inkscape:window-maximized="0"
        inkscape:current-layer="图层_1" />
    <style
            type="text/css"
            id="style2">
	.st0{fill:url(#path-1-copy-7_1_);}
	.st1{fill:#FFFFFF;}
</style>
    <g
            id="Group"
            transform="matrix(4.0738988,0,0,4.0738988,-1436.4536,-1166.3541)">
	<g
            id="icon_imTokenLogo">

			<linearGradient
                    id="path-1-copy-7_1_"
                    gradientUnits="userSpaceOnUse"
                    x1="-229.26199"
                    y1="763.88239"
                    x2="-230.62849"
                    y2="762.52502"
                    gradientTransform="matrix(134.3987,0,0,-134.8504,31348.697,103302.03)">
			<stop
                    offset="0"
                    style="stop-color:#11C4D1"
                    id="stop4" />
                <stop
                        offset="1"
                        style="stop-color:#0062AD"
                        id="stop6" />
		</linearGradient>
        <path
                id="path-1-copy-7"
                class="st0"
                d="m 541.5,416.1 c 0,0 0,19.8 -2.1,28.3 -2.1,8.6 -6.1,14.5 -10.4,18.9 -4.4,4.4 -10.2,8.4 -19,10.5 -8.9,2.1 -28.1,2 -28.1,2 h -69.8 c 0,0 -19.7,0 -28.2,-2.1 -8.5,-2.2 -14.5,-6.1 -18.9,-10.5 -4.4,-4.4 -8.4,-10.2 -10.4,-19.1 -2.1,-8.9 -2,-28.1 -2,-28.1 v -70 c 0,0 0,-19.8 2.1,-28.3 2.1,-8.6 6.1,-14.5 10.4,-18.9 4.4,-4.4 10.2,-8.4 19,-10.5 8.9,-2.1 28.1,-2 28.1,-2 H 482 c 0,0 19.7,0 28.2,2.1 8.5,2.2 14.5,6.1 18.9,10.5 4.4,4.4 8.4,10.2 10.4,19.1 2,8.9 2,28.1 2,28.1 z"
                style="fill:url(#path-1-copy-7_1_)"
                inkscape:connector-curvature="0" />
        <path
                id="Combined-Shape"
                class="st1"
                d="m 511.9,344.2 c 3.9,53.9 -31.9,79.5 -64,82.3 -29.8,2.6 -57.8,-15 -60.2,-42.3 -2,-22.5 12.4,-32.2 23.7,-33.1 11.6,-1 21.3,6.7 22.2,16.1 0.8,9 -5,13.2 -9.1,13.5 -3.2,0.3 -7.2,-1.6 -7.6,-5.6 -0.3,-3.5 1.1,-3.9 0.7,-7.6 -0.6,-6.6 -6.5,-7.3 -9.7,-7 -3.9,0.3 -11,4.8 -10.1,15.8 1,11.1 12,19.9 26.4,18.6 15.6,-1.4 26.5,-13.1 27.3,-29.6 0,-0.9 0.2,-1.7 0.6,-2.5 0,0 0,0 0,0 0.2,-0.3 0.3,-0.6 0.6,-0.9 0,0 0,0 0,0 0.4,-0.6 0.8,-1.1 1.3,-1.6 0,0 0,0 0,0 0.4,-0.4 0.9,-0.9 1.4,-1.4 6.8,-6.2 31.4,-21 54.5,-16.4 0.2,0 0.4,0.1 0.5,0.2 0.9,0 1.4,0.7 1.5,1.5"
                inkscape:connector-curvature="0"
                style="fill:#ffffff" />
	</g>
</g>
</svg>
`

const imToken = {
    name: 'imToken',
    svg: Logo,
    wallet: async (helpers: Helpers) => {
        const { createModernProviderInterface } = helpers
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const provider = (window as any).ethereum
        return {
            provider,
            interface: createModernProviderInterface(provider),
        }
    },
    link: 'https://token.im/',
    mobile: true,
    desktop: false,
}

export default imToken
