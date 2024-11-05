import Conf from "conf"

export const configStore = (mode) => new Conf({projectName: 'rkwebserver', configName: `${mode}config`})