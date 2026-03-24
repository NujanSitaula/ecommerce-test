'use client';

import { ToastContainer, cssTransition, TypeOptions } from 'react-toastify';
import cn from 'classnames';

const slideFromTop = cssTransition({
  enter: 'rt-slide-in-down',
  exit: 'rt-slide-out-up',
});

const ToasterProvider = () => {
  return (
    <ToastContainer
      position="top-center"
      style={{
        top: '1rem',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 11000,
      }}
      autoClose={2000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      pauseOnHover
      draggable
      theme="colored"
      transition={slideFromTop}
      toastClassName={(context) =>
        cn(
          'relative flex p-3 min-h-0 rounded-md shadow-lg text-sm border',
          {
            'bg-red-50 text-red-800 border-red-200':
              context?.type === ('error' as TypeOptions),
            'bg-blue-50 text-blue-800 border-blue-200':
              context?.type === ('info' as TypeOptions),
            'bg-green-50 text-green-800 border-green-200':
              context?.type === ('success' as TypeOptions),
            'bg-amber-50 text-amber-800 border-amber-200':
              context?.type === ('warning' as TypeOptions),
          },
        )
      }
      className="flex items-start"
      progressClassName="bg-brand"
      closeButton={false}
    />
  );
};

export default ToasterProvider;
