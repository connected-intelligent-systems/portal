import React from "react";
import { Box, Typography, Alert } from "@mui/material";
import { useTranslate } from "react-admin";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
  messages?: {
    somethingWentWrong: string;
    unexpectedError: string;
  };
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Asset component error:", error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return (
          <FallbackComponent
            error={this.state.error!}
            resetError={this.resetError}
          />
        );
      }

      return (
        <Box p={3}>
          <Alert severity="error">
            <Typography variant="h6">
              {this.props.messages?.somethingWentWrong ||
                "Something went wrong"}
            </Typography>
            <Typography variant="body2">
              {this.state.error?.message ||
                this.props.messages?.unexpectedError ||
                "An unexpected error occurred"}
            </Typography>
          </Alert>
        </Box>
      );
    }

    return this.props.children;
  }
}

// Wrapper component that provides translations
export const TranslatedErrorBoundary: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const translate = useTranslate();

  const messages = {
    somethingWentWrong: translate(
      "resources.assets.messages.somethingWentWrong"
    ),
    unexpectedError: translate("resources.assets.messages.unexpectedError"),
  };

  return <ErrorBoundary messages={messages}>{children}</ErrorBoundary>;
};
