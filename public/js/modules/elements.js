export const elementTemplatesPromise = loadElementTemplates();

async function loadElementTemplates() {
    let templates = {};

    const fileListResponse = await fetch('/templates/files');
    const fileList = await fileListResponse.json();

    const fetchPromises = fileList.map(async file => {
        const [category, typeWithExtension] = file.split('_');
        const type = typeWithExtension.split('.')[0];

        if (!templates[category]) {
            templates[category] = {};
        }

        const response = await fetch(`/templates/${file}`);
        if (response.ok) {
            templates[category][type] = await response.text();
        }
    });

    await Promise.all(fetchPromises);
	console.log("Loaded templates:",templates)

    return templates;
}