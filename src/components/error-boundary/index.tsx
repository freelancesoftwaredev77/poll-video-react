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
        <div className="flex items-center justify-center h-screen">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <h1 className="text-2xl font-bold my-5">Something went wrong.</h1>
            <p className="mb-5 text-sm">
              {
                " We're sorry for the inconvenience. Please try refreshing the page."
              }
            </p>
            <div className="flex items-center justify-between gap-5 my-5">
              <Button
                type="button"
                text="Refresh"
                variant="outline"
                className=""
                onClick={this.handleRefresh}
              />
              <Button
                type="button"
                text="Back to Home"
                variant="primary"
                className=""
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
