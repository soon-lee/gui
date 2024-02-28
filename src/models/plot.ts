export class PlotItem {
    origin: { [key: string]: string | number };

    constructor (origin?: { [key: string]: string | number }) {
        this.origin = origin || {};
    }

    hasOwnProperty (key: string) {
        return this.origin.hasOwnProperty(key);
    }

    getString (key: string) {
        return this.origin[key] as string;
    }

    getNumber (key: string) {
        return this.origin[key] as number;
    }
}

export class PlotData {
    items: PlotItem[];
    dimension: string;
    measure: string;
    group: string;
    rate: string;
    sort: string[];

    constructor (props?: {
        items?: PlotItem[],
        dimension?: string,
        measure?: string,
        group?: string,
        rate?: string,
        sort?: string[]
    }) {
        this.items = props?.items || [];
        this.dimension = props?.dimension || "dimension";
        this.measure = props?.measure || "measure";
        this.group = props?.group || "group";
        this.rate = props?.rate || "rate";
        this.sort = props?.sort || [];
    }
}

export class PlotConfig {
    width: number;
    height: number;
    margin: [number,number,number,number];
    colors: { [key: string]: string };


    constructor (props?: {
        width?: number,
        height?: number,
        margin?:  [number,number,number,number],
        colors?: { [key: string]: string }
    }) {
        this.width = props?.width || 0;
        this.height = props?.height || 0;
        this.margin = props?.margin || [0,0,0,0];
        this.colors = props?.colors || {};
    }
}

export class PlotProps {
    data: PlotData;
    config: PlotConfig;

    constructor (props?: { data?: PlotData, config?: PlotConfig }) {
        this.data = props?.data || new PlotData();
        this.config = props?.config || new PlotConfig();
    }
}