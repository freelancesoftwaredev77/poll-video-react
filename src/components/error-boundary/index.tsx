/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable class-methods-use-this */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import Button from '../button';

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<object, ErrorBoundaryState> {
  constructor(props: object) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  handleRefresh = (): void => {
    window.location.reload();
  };

  handleBackToHome = (): void => {
    window.location.href = '/';
  };

  render(): React.ReactNode {
    if (this.state?.hasError) {
      return (
        <div className="flex h-screen items-center justify-center">
          <div className="rounded-lg bg-white p-8 text-center shadow-lg">
            <h1 className="my-5 text-2xl font-bold">Something went wrong.</h1>
            <p className="mb-5 text-sm">
              {
                " We're sorry for the inconvenience. Please try refreshing the page."
              }
            </p>
            <div className="my-5 flex items-center justify-between gap-5">
              <Button
                type="button"
                text="Refresh"
                variant="outline"
                onClick={this.handleRefresh}
              />
              <Button
                type="button"
                text="Back to Home"
                variant="primary"
                onClick={this.handleBackToHome}
              />
            </div>
          </div>
        </div>
      );
    }
    // @ts-expect-error
    return this?.props?.children;
  }
}

export default ErrorBoundary;
