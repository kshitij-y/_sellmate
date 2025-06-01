const VerifyEmail = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-[90%] max-w-[600px] p-8 rounded-2xl shadow-lg border border-gray-300 dark:border-gray-700 text-center transition-all duration-300">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          🎉 Verify Your Email!
        </h1>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          We’ve sent a verification email to your inbox. Please check your email
          and click the link to verify your account.
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
          Didn’t receive the email?
          <span className="text-blue-500 dark:text-blue-400 hover:underline cursor-pointer">
            {" "}
            Resend verification email
          </span>
        </p>
        <p className="mt-6 text-gray-500 dark:text-gray-400">
          You can close this window now.
        </p>
      </div>
    </div>
  );
};

export default VerifyEmail;
