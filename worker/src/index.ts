// snorr.io worker
// Serves the landing page and redirects /install to the install script.

const INSTALL_URL = "https://raw.githubusercontent.com/lrhodin/snorrio/main/install.sh";

export default {
  async fetch(request: Request, env: any) {
    const url = new URL(request.url);

    if (url.pathname === "/install" || url.pathname === "/install.sh") {
      return Response.redirect(INSTALL_URL, 302);
    }

    // Static assets handle everything else (index.html for /)
    return new Response("Not found", { status: 404 });
  },
};
