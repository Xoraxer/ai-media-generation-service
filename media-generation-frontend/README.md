# AI Image Generator Frontend

A modern React SPA for generating images using Stable Diffusion via the Replicate API. Built with TypeScript, Vite, and Shadcn UI.

## Features

### 🎨 Generate Tab
- **Text-to-Image Generation**: Create stunning images from text prompts
- **Model Selection**: Choose from different Stable Diffusion models
- **Real-time Feedback**: Instant validation and error handling
- **Tips & Guidance**: Built-in suggestions for better prompts

### 📸 History Tab
- **Image Gallery**: View all generated images in a responsive grid
- **Job Status Tracking**: Real-time status updates (pending, processing, completed, failed)
- **Download & Share**: Download images or open in new tab
- **Error Handling**: Clear error messages for failed generations

### 🏗️ Architecture Tab
- **System Overview**: Detailed explanation of the technical architecture
- **Technology Stack**: Complete breakdown of frontend and backend technologies
- **Data Flow**: Visual representation of the request-response cycle
- **Design Principles**: Architectural decisions and best practices

## Technology Stack

- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development with excellent IDE support
- **Vite** - Lightning-fast build tool and dev server
- **Shadcn UI** - Beautiful, accessible component library
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Consistent and beautiful icons
- **Radix UI** - Unstyled, accessible UI primitives

## Getting Started

### Prerequisites

- Node.js 18+ (recommended: Node.js 20+)
- npm or yarn package manager

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Create a `.env` file in the root directory:
   ```env
   VITE_API_URL=http://localhost:8000/api/v1
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── ui/                 # Shadcn UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── tabs.tsx
│   │   └── ...
│   ├── GenerateTab.tsx     # Image generation interface
│   ├── HistoryTab.tsx      # Image gallery and history
│   └── ArchitectureTab.tsx # System architecture documentation
├── lib/
│   ├── api.ts              # API client with error handling
│   └── utils.ts            # Utility functions
├── types/
│   └── api.ts              # TypeScript type definitions
├── App.tsx                 # Main application component
├── main.tsx                # Application entry point
└── index.css               # Global styles and Tailwind directives
```

## API Integration

The frontend communicates with the FastAPI backend through a type-safe API client:

- **POST /generate** - Submit new image generation job
- **GET /status/{job_id}** - Get job status and results
- **GET /jobs** - Retrieve recent job history
- **GET /images/{filename}** - Serve generated images

## Features in Detail

### Real-time Updates
- Automatic polling for job status updates
- Live status indicators with loading animations
- Instant UI updates when jobs complete

### Error Handling
- Comprehensive error boundaries
- User-friendly error messages
- Retry mechanisms for failed requests

### Responsive Design
- Mobile-first approach
- Adaptive layouts for all screen sizes
- Touch-friendly interactions

### Accessibility
- WCAG 2.1 compliant components
- Keyboard navigation support
- Screen reader optimized
- High contrast mode support

## Development

### Code Style
- ESLint configuration for consistent code style
- TypeScript strict mode enabled
- Prettier integration for automatic formatting

### Performance
- Code splitting with React.lazy
- Optimized bundle size with Vite
- Efficient image loading and caching
- Minimal re-renders with proper memoization

### Testing
```bash
npm run test
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:8000/api/v1` |

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
