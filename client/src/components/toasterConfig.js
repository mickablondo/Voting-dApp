const toasterDefaultStyle = { maxWidth: '500px'};
const toasterDefaultOptions = { position: 'top-center', style: toasterDefaultStyle };
const toasterOptionsWithSuccess = {...toasterDefaultOptions, 
  success: {
    duration: 5000,
    icon: '🔥',
}};

export { toasterDefaultStyle, toasterDefaultOptions, toasterOptionsWithSuccess };