// Runs before paint so the stored theme applies without a flash.
export const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem("ms_theme");document.documentElement.setAttribute("data-theme",t||"light")}catch(e){}})()`;
