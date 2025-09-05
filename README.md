#  Portal

This repository contains the frontend code for the SmartLivingNEXT portal. The portal provides a web interface for managing Eclipse Data Connector (EDC) resources. 

## How to run this image
```shell
docker run -it --rm --name portal registry.int.smartlivingnext.de/registry/public/portal:latest
```

## Development

The portal is a frontend-only application built with Vite and React. For development, configure your Vite proxy to route API calls directly to your EDC management API.

### Running locally
```shell
cd frontend
npm install
npm run dev
```

### Configuration

Configure the EDC connection in your Vite development proxy or directly in the frontend application. The frontend communicates directly with the EDC management API.

## Production Deployment

The production build uses nginx to serve the static frontend files. An optional nginx proxy configuration is provided for routing API calls to EDC services.

## Authors

Sebastian Alberternst <sebastian.alberternst@dfki.de>

## License

MIT 

