$(".rslides").responsiveSlides({
    auto: true,             // Boolean: Animate automatically, true or false
    speed: 2000,            // Integer: Speed of the transition, in milliseconds
    timeout: 10000,          // Integer: Time between slide transitions, in milliseconds
    pager: true,           // Boolean: Show pager, true or false
    nav: false,             // Boolean: Show navigation, true or false      // Boolean: Randomize the order of the slides, true or false          // Boolean: Pause on hover, true or false
    pauseControls: true,    // Boolean: Pause when hovering controls, true or false
    prevText: "Previous",   // String: Text for the "previous" button
    nextText: "Next",       // String: Text for the "next" button  // Function: After callback
  });