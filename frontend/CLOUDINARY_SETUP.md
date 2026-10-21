# Cloudinary image upload setup

LetsChat currently uploads image bytes directly from the browser to Cloudinary. The frontend needs a cloud name and an unsigned upload preset; it does not need the Cloudinary API secret.

## 1. Find your cloud name

In the Cloudinary Console, copy the **Cloud name** shown on the dashboard.

## 2. Create an unsigned upload preset

1. Open **Settings → Upload → Upload presets** in the Cloudinary Console.
2. Create a preset and set its signing mode to **Unsigned**.
3. Restrict it to image formats the app supports, such as `jpg`, `jpeg`, `png`, `webp`, and `gif`.
4. Enable **Disallow public ID** (or the equivalent setting in the console) so clients cannot choose asset IDs.
5. Save the preset and copy its preset name.

Cloudinary requires an unsigned preset for unauthenticated browser uploads. The preset name is visible in client code, so treat the preset as a public upload capability and restrict its settings. Cloudinary's [upload preset security guide](https://cloudinary.com/documentation/upload_presets) has the current console options and recommendations.

## 3. Configure Vite

For local development, create `frontend/.env.local`:

```env
VITE_CLOUDINARY_CLOUD=your_cloud_name
VITE_CLOUDINARY_PRESET=your_unsigned_preset_name
```

The app also needs `VITE_API_URL` and `VITE_WS_URL`; see [`frontend/.env.example`](./.env.example). Restart the Vite dev server after changing env files.

For a deployed frontend, add the same variables to the frontend host's build environment and rebuild/redeploy. Vite embeds `VITE_` values in browser assets, so the hosting dashboard may correctly label them as public.

**Never use `VITE_` for `CLOUDINARY_API_SECRET` or any other secret.** A browser upload cannot keep a secret private.

## How the current upload works

1. The image picker in `MessageInput` calls `uploadImage` in `src/App.jsx`.
2. The frontend posts the file and `upload_preset` to `https://api.cloudinary.com/v1_1/<cloud-name>/upload`.
3. On success, it takes `secure_url` from Cloudinary's response.
4. If a room is selected and the WebSocket is connected, it sends that URL as the message's `media` field. The backend stores and broadcasts the URL with the chat message.

The backend does not receive or validate the image file in this flow. The upload request also does not go through the app's login API. Anyone who obtains the unsigned preset name can attempt uploads, even if the app's own UI requires login. For a public production app that needs account-level upload control, move uploads behind an authenticated backend endpoint and use signed Cloudinary uploads. Keep the Cloudinary API secret on the backend only. See Cloudinary's [upload authentication guide](https://cloudinary.com/documentation/upload_images).

## Troubleshooting

- **“Cloudinary config missing”**: check that both Vite variables are set, then restart the dev server or rebuild the frontend.
- **Preset or upload errors**: confirm the cloud name is exact and the preset is configured as unsigned.
- **Upload succeeds but no chat image appears**: select a room and make sure the WebSocket status is connected before uploading.
- **Unexpected uploads**: replace or disable the unsigned preset in Cloudinary, update the frontend value, and consider switching to authenticated signed uploads.
