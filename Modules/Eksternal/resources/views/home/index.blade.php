@extends('layouts.home')

@section('title', 'JIS')

@push('styles')
    <style>
        .grecaptcha-badge {
            visibility: hidden;
        }

        html {
            scroll-behavior: smooth;
        }

        img.logo {
            height: 40px;
        }

        @media screen and (min-width: 768px) {
            img.logo {
                height: 60px;
            }
        }

        .navbar {
            transition-property: all;
            transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
            transition-duration: 300ms;
        }

        .ql-align-right {
            text-align: right;
        }
        .ql-align-center {
            text-align: center;
        }
        .ql-align-left {
            text-align: left;
        }

        main {
            gap: rem;
        }

        .section-wrapper {
            max-width: 1440px
        }

        .navbar-nav {
            margin-left: auto;
        }

        .slick-prev:before, .slick-next:before {
            color: gray !important;
            font-size: 32px;
        }

        .slick-next {
            right: 20px;
            z-index: 10;
        }

        .slick-prev {
            left: 20px;
            z-index: 10;
        }

        .slick-prev-banner:before {
            content: none;
        }

        .slick-next-banner:before {
            content: none;
        }

        .slick-prev-banner {
            display: none !important;
            height: 60px;
            width: 40px;
            border-radius: 0.25rem;
        }

        .slick-next-banner {
            display: none !important;
            height: 60px;
            width: 40px;
            border-radius: 0.25rem;
        }

        .slick-prev-banner > i {
            font-size: 2rem !important;
        }

        .slick-next-banner > i {
            font-size: 2rem !important;
        }

        /* Testimonials Section Styling */
        .testimonials-section {
            padding: 4rem 0 !important;
            background-color: #f9fafb;
        }

        .testimonials-header {
            margin-bottom: 1rem;
        }

        .testimonials-header .fs-1 {
            font-size: 2.5rem !important;
            font-weight: 700 !important;
            color: #1f2937 !important;
            margin-bottom: 1rem;
        }

        .testimonials-header p {
            font-size: 1.1rem;
            color: #6b7280;
            max-width: 600px;
            margin: 0 auto;
        }

        .testimonials-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
            gap: 2rem;
            max-width: 100%;
        }

        @media (min-width: 768px) {
            .testimonials-grid {
                grid-template-columns: repeat(3, 1fr);
            }
        }

        @media (max-width: 1024px) {
            .testimonials-grid {
                grid-template-columns: repeat(2, 1fr);
            }
        }

        @media (max-width: 640px) {
            .testimonials-grid {
                grid-template-columns: 1fr;
            }
        }

        /* Testimonials Carousel Styling */
        .slick-carousel-testimonials {
            position: relative;
            margin: 0;
            width: 100%;
            visibility: hidden;
            overflow: visible !important;
        }

        .slick-carousel-testimonials.slick-initialized {
            visibility: visible;
        }

        .slick-carousel-testimonials .slick-list {
            margin: 0;
            padding: 0;
        }

        .slick-carousel-testimonials .slick-slide {
            padding: 15px;
            height: auto;
            box-sizing: border-box;
        }

        .slick-carousel-testimonials .slick-prev,
        .slick-carousel-testimonials .slick-next {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            z-index: 20 !important;
            width: 48px;
            height: 48px;
            padding: 0 !important;
            border-radius: 50% !important;
            background: rgba(20, 184, 166, 0.1) !important;
            border: 2px solid rgba(20, 184, 166, 0.3) !important;
            transition: all 0.3s ease;
            display: flex !important;
            align-items: center;
            justify-content: center;
            cursor: pointer !important;
            pointer-events: auto !important;
            outline: none !important;
            box-shadow: none !important;
        }

        .slick-carousel-testimonials .slick-prev {
            left: -70px;
        }

        .slick-carousel-testimonials .slick-next {
            right: -70px;
        }

        .slick-carousel-testimonials .slick-prev:hover,
        .slick-carousel-testimonials .slick-next:hover,
        .slick-carousel-testimonials .slick-prev:focus,
        .slick-carousel-testimonials .slick-next:focus {
            background: rgba(20, 184, 166, 0.2) !important;
            border-color: rgba(20, 184, 166, 0.6) !important;
        }

        .slick-carousel-testimonials .slick-prev:before,
        .slick-carousel-testimonials .slick-next:before {
            content: none !important;
        }

        .slick-carousel-testimonials .slick-prev svg,
        .slick-carousel-testimonials .slick-next svg {
            width: 24px;
            height: 24px;
            opacity: 0.8;
            transition: opacity 0.3s ease;
            pointer-events: none;
        }

        .slick-carousel-testimonials .slick-prev svg path,
        .slick-carousel-testimonials .slick-next svg path {
            stroke: #14b8a6 !important;
            pointer-events: none;
        }

        .slick-carousel-testimonials .slick-prev:hover svg,
        .slick-carousel-testimonials .slick-next:hover svg {
            opacity: 1;
        }

        @media (max-width: 1024px) {
            .slick-carousel-testimonials .slick-prev {
                left: -60px;
            }

            .slick-carousel-testimonials .slick-next {
                right: -60px;
            }
        }

        @media (max-width: 768px) {
            .slick-carousel-testimonials .slick-prev,
            .slick-carousel-testimonials .slick-next {
                width: 40px;
                height: 40px;
            }

            .slick-carousel-testimonials .slick-prev {
                left: -55px;
            }

            .slick-carousel-testimonials .slick-next {
                right: -55px;
            }

            .slick-carousel-testimonials .slick-prev svg,
            .slick-carousel-testimonials .slick-next svg {
                width: 20px;
                height: 20px;
            }
        }

        .testimonial-card {
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 0.75rem;
            padding: 2rem;
            display: flex;
            flex-direction: column;
            /* gap: 1.5rem; */
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            cursor: default;
        }

        .testimonial-card:hover {
            border-color: #14b8a6;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            transform: scale(1.05);
        }

        .testimonial-quote-icon {
            font-size: 3rem;
            color: #14b8a6;
            opacity: 0.4;
            line-height: 1;
            font-weight: bold;
        }

        .testimonial-quote-icon::before {
            content: '';
            display: block;
            width: 45;
            height: 45px;
            background-image: url('{{ asset("assets/media/logos/quote.svg") }}');
            background-size: contain;
            background-repeat: no-repeat;
            filter: brightness(0) saturate(100%) invert(46%) sepia(40%) saturate(400%) hue-rotate(135deg) brightness(105%) contrast(100%);
        }

        .testimonial-content {
            font-size: 1rem;
            color: #374151;
            line-height: 1.6;
            font-style: italic;
            flex-grow: 1;
        }

        .testimonial-author {
            display: flex;
            align-items: center;
            gap: 1rem;
        }

        .testimonial-avatar {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            color: white;
            font-size: 1.1rem;
            flex-shrink: 0;
        }

        .testimonial-avatar-1 {
            background: linear-gradient(135deg, #14b8a6 0%, #0891b2 100%);
        }

        .testimonial-avatar-2 {
            background: linear-gradient(135deg, #0891b2 0%, #06b6d4 100%);
        }

        .testimonial-avatar-3 {
            background: linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%);
        }

        .testimonial-avatar-4 {
            background: linear-gradient(135deg, #0891b2 0%, #14b8a6 100%);
        }

        .testimonial-avatar-5 {
            background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
        }

        .testimonial-avatar-6 {
            background: linear-gradient(135deg, #14b8a6 0%, #0891b2 100%);
        }

        .testimonial-info h4 {
            font-size: 1.1rem;
            font-weight: 600;
            color: #111827;
            margin: 0;
            margin-bottom: 0.25rem;
        }

        .testimonial-info p {
            font-size: 0.875rem;
            color: #6b7280;
            margin: 0;
        }

        @media (max-width: 576px) {
            .testimonials-section {
                padding: 2rem 0 !important;
            }

            .testimonials-header .fs-1 {
                font-size: 2rem !important;
                margin-bottom: 0.75rem;
            }

            .testimonials-header p {
                font-size: 1rem;
            }

            .testimonial-card {
                padding: 1.5rem;
                gap: 1rem;
            }

            .testimonial-content {
                font-size: 0.95rem;
            }
        }

        .bg-tosca {
            background-color: #017780fa;
        }

        .logo-bg {
            border: none !important;
            padding: 1.25rem 1.5rem 1.5rem 1.5rem !important;
            margin-left: 0.5rem;
        }

        img.logo {
            transition: filter 300ms cubic-bezier(0.4, 0, 0.2, 1);
            filter: brightness(0) invert(1);
        }

        img.logo.scrolled {
            filter: brightness(1) invert(0);
        }

        .banner-image-background {
            width: 100%;
            height: 70dvh;
            object-fit: cover;
            object-position: center;
        }

        /* Prevent flicker: hide banner container until slick initializes */
        .slick-carousel-banners {
            visibility: hidden;
            position: relative;
            overflow: visible !important;
        }

        .slick-carousel-banners.slick-initialized {
            visibility: visible;
        }

        .banner-image-container {
            position: relative;
            overflow: hidden;
        }

        .banner-image-container img {
            will-change: transform;
        }

        .banner-image-overlay {
            background: rgba(0, 0, 0, .5);
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }

        .banner-card {
            position: absolute;
            bottom: 10%;
            left: 5%;
            right: 5%;
            padding: 2rem;
            border-radius: 0.5rem;
            background-color: rgba(255, 255, 255, 0.09);
            backdrop-filter: blur(10px);

            width: 90vw;
            max-width: 1100px;
            box-sizing: border-box;
        }

        .banner-cta-button {
            display: inline-block;
            margin-top: 1rem;
            padding: 0.6rem 1.15rem;
            color: #fff;
            background: linear-gradient(to right, #14b8a6, #0891b2);
            border-radius: 0.6rem;
            text-decoration: none;
            font-weight: 700;
            transition: background-color .18s ease, transform .12s ease;
        }

        .banner-cta-button:hover {
            background-color: #2c8c9bff;
            transform: translateY(-2px);
            color: #fff;
        }

        @media screen and (max-width: 767px) {
            .banner-card {
                padding: 1rem;
                bottom: 48%;
            }
            .banner-cta-button {
                width: auto;
            }
        }

        .footer-img {
            width: 3.5rem;
            aspect-ratio: 1/1;
            object-fit: contain;
        }

        @media screen and (min-width: 768px) {
            .logo-bg {
                width: fit-content;
                border: 1px solid #cecece;
            }

            .nav-link {
                font-size: 1.5rem;
                padding: 1rem 1.5rem !important;
            }

            .slick-prev-banner, .slick-next-banner {
                display: block !important;
                height: 80px !important;
                width: 60px !important;
            }

            .banner-card {
                width: 720px;
                max-width: 65vw;
                bottom: 25%;
                left: 8%;
                border-radius: 1rem;
                padding: 2.5rem;
            }

            .footer-img {
                width: 10rem;
            }

            .slick-carousel-scale-animate .slick-slide {
                transition-property: all;
                transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
                transition-duration: 300ms;
                opacity: 0.85;
                transform: scale(0.8);
                display: flex;
            }

            .slick-carousel-scale-animate .slick-slide > div {
                margin: auto;
            }

            .slick-carousel-scale-animate .slick-current {
                padding-top: 1rem;
                padding-bottom: 1rem;
                transform: scale(1.1);
                opacity: 1;
            }
        }

        img.mitra-logo {
            -webkit-filter: grayscale(100%);
            filter: grayscale(100%);
        }

        /* Add color on hover */
        img.mitra-logo:hover {
            -webkit-filter: grayscale(0%);
            filter: grayscale(0%);
        }

        .social-logo {
            cursor: pointer;
            width: 2.75rem;
            aspect-ratio: 1/1;
            border: 1px solid white;
            display: grid;
            place-items: center;
            color: white;
            transition-property: all;
            transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
            transition-duration: 300ms;
        }

        .social-logo > i {
            color: white;
        }

        .social-logo:hover {
            background-color: white;
        }

        .social-logo:hover > i {
            color: #0D47A1;
        }

        .navbar:not(.bg-light) .nav-link {
            color: white;
        }

        body {
            background-color: white;
        }

        /* Add shadow to cards */
        .card {
            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
        }

        /* Rounded input */
        .form-control {
            border-radius: 0.5rem;
        }

        /* Slick Carousel Dots Styling */
        .slick-carousel-banners .slick-dots {
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            display: flex !important;
            justify-content: center;
            gap: 12px;
            list-style: none;
            z-index: 10;
            white-space: nowrap;
            pointer-events: auto;
        }

        .slick-carousel-banners .slick-dots li {
            margin: 0;
            padding: 0;
        }

        .slick-carousel-banners .slick-dots li button {
            width: 25px;
            height: 7px;
            padding: 0;
            border: none;
            border-radius: 5px;
            background-color: rgba(255, 255, 255, 0.4);
            cursor: pointer;
            font-size: 0;
            transition: all 0.3s ease;
        }

        .slick-carousel-banners .slick-dots li button::before {
            display: none !important;
        }

        .slick-carousel-banners .slick-dots li button:hover {
            background-color: rgba(255, 255, 255, 0.7);
            transform: scaleX(1.1);
        }

        .slick-carousel-banners .slick-dots li.slick-active button {
            width: 27.5px;
            height: 7px;
            background-color: rgba(255, 255, 255, 1);
            transform: scaleX(1);
        }

        /* Company Overview Section */
        .company-overview-section {
            background: transparent;
            padding: 60px 0;
        }

        .company-overview-container {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 60px;
            align-items: center;
        }

        .company-overview-content h1 {
            font-size: 4.5rem;
            font-weight: 700;
            color: #0891b2;
            margin-bottom: 30px;
            letter-spacing: -1px;
        }

        .company-overview-content p {
            font-size: 1.1rem;
            line-height: 1.8;
            color: #555;
            margin-bottom: 0;
        }

        .company-statistics {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
        }

        .statistic-item {
            text-align: left;
            padding: 20px;
            border-radius: 12px;
            background: transparent;
            box-shadow: none;
            transition: all 0.3s ease;
        }

        .statistic-item:hover {
            box-shadow: none;
            transform: translateY(0);
        }

        .statistic-value {
            font-size: 2.8rem;
            font-weight: 700;
            color: #0891b2;
            display: block;
            margin-bottom: 12px;
            letter-spacing: -1px;
        }

        .statistic-label {
            font-size: 0.95rem;
            color: #888;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        @media (max-width: 992px) {
            .company-overview-container {
                grid-template-columns: 1fr;
                gap: 40px;
            }

            .company-overview-content h1 {
                font-size: 3.2rem;
            }

            .company-statistics {
                grid-template-columns: 1fr 1fr;
                gap: 30px;
            }

            .statistic-value {
                font-size: 2.2rem;
            }
        }

        @media (max-width: 576px) {
            .company-overview-section {
                padding: 40px 0;
            }

            .company-overview-container {
                gap: 30px;
            }

            .company-overview-content h1 {
                font-size: 2.5rem;
                margin-bottom: 20px;
            }

            .company-overview-content p {
                font-size: 1rem;
            }

            .company-statistics {
                gap: 20px;
            }

            .statistic-item {
                padding: 15px;
            }

            .statistic-value {
                font-size: 1.8rem;
            }

            .statistic-label {
                font-size: 0.85rem;
            }
        }

        /* Services Section Redesign */
        .services-section-wrapper {
            display: grid;
            grid-template-columns: 1fr 2.8fr;
            gap: 40px;
            align-items: flex-start;
        }

        .services-content-left {
            display: flex;
            flex-direction: column;
            gap: 24px;
        }

        .services-title {
            font-size: 4.2rem;
            font-weight: 700;
            color: #0891b2;
            margin-bottom: 16px;
            line-height: 1.2;
            letter-spacing: -1px;
        }

        .services-description {
            font-size: 1.15rem;
            line-height: 1.7;
            color: #666;
        }

        .services-carousel-wrapper {
            position: relative;
            width: 100%;
            overflow: hidden;
            margin-bottom: 20px;
        }

        /* Slick carousel customization for services */
        .slick-carousel-services {
            position: relative;
            margin: 0;
            margin-bottom: 60px;
            width: 100%;
        }

        .slick-carousel-services .slick-list {
            margin: 0;
            padding: 0;
        }

        .service-card {
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            /* cursor: pointer; */
            display: flex !important;
            flex-direction: column;
            height: 82%;
        }

        .service-card:hover {
            border-color: #14b8a6;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            transform: scale(1.05);
        }

        .service-card-image-wrapper {
            position: relative;
            width: 100%;
            height: 280px;
            border-radius: 16px 16px 0 0;
            overflow: hidden;
        }

        .service-card-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center;
        }

        .service-card-number {
            position: absolute;
            top: 12px;
            right: 12px;
            width: 40px;
            height: 40px;
            background: linear-gradient(to right, #14b8a6, #0891b2);
            color: white;
            border-radius: 25%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 1.1rem;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            z-index: 5;
            backdrop-filter: blur(3px);

        }

        .service-card-content {
            padding: 24px;
            padding-bottom: 15px;
            display: flex;
            flex-direction: column;
            gap: 12px;
            flex-grow: 1;
        }

        .service-card-title {
            font-size: 1.25rem;
            font-weight: 700;
            color: #0891b2;
            margin: 0;
        }

        .service-card-description {
            font-size: 0.9rem;
            line-height: 1.6;
            color: #666;
            margin: 0;
            flex-grow: 1;
        }

        .slick-carousel-services .slick-slide {
            padding: 35px 15px;
            height: auto;
            box-sizing: border-box;
        }

        .slick-carousel-services .slick-slide > div {
            margin: 0;
        }

        .slick-carousel-services .slick-prev,
        .slick-carousel-services .slick-next {
            position: absolute;
            bottom: -30px;
            top: auto;
            transform: none !important;
            z-index: 20 !important;
            width: 40px;
            height: 40px;
            padding: 0 !important;
            border-radius: 50% !important;
            background: rgba(0, 51, 102, 0) !important;
            border: 2px solid rgba(0, 51, 102, 0.4) !important;
            transition: all 0.3s ease;
            display: flex !important;
            align-items: center;
            justify-content: center;
            left: auto !important;
            right: auto;
            cursor: pointer !important;
            pointer-events: auto !important;
            outline: none !important;
            box-shadow: none !important;
        }

        .slick-carousel-services .slick-prev {
            right: 56px;
            left: auto;
        }

        .slick-carousel-services .slick-next {
            right: 0;
        }

        .slick-carousel-services .slick-prev:hover,
        .slick-carousel-services .slick-next:hover,
        .slick-carousel-services .slick-prev:focus,
        .slick-carousel-services .slick-next:focus {
            background: #0890b23a !important;
            border-color: #0891b2 !important;
        }

        .slick-carousel-services .slick-prev:active,
        .slick-carousel-services .slick-next:active {
            background: #0890b23a !important;
            border-color: #0891b2 !important;
        }

        .slick-carousel-services .slick-prev:before,
        .slick-carousel-services .slick-next:before {
            content: none !important;
        }

        .slick-carousel-services .slick-prev svg,
        .slick-carousel-services .slick-next svg {
            width: 24px;
            height: 24px;
            opacity: 0.8;
            transition: opacity 0.3s ease, stroke-width 0.3s ease;
            pointer-events: none;
        }

        .slick-carousel-services .slick-prev svg path,
        .slick-carousel-services .slick-next svg path {
            stroke: #0891b2 !important;
            pointer-events: none;
        }

        .slick-carousel-services .slick-prev:hover svg,
        .slick-carousel-services .slick-next:hover svg {
            opacity: 1;
            stroke-width: 2.5;
        }

        /* Slick Carousel Dots for Services */
        .slick-carousel-services .slick-dots {
            position: absolute;
            bottom: -20px;
            left: 0;
            right: 0;
            transform: none;
            display: flex !important;
            justify-content: center;
            gap: 10px;
            list-style: none;
            z-index: 10;
            width: 100%;
            margin: 0;
        }

        .slick-carousel-services .slick-dots li {
            margin: 0;
            padding: 0;
            list-style: none;
        }

        .slick-carousel-services .slick-dots li button {
            width: 12px;
            height: 12px;
            padding: 0;
            border: none;
            border-radius: 50%;
            background-color: #0890b218;
            cursor: pointer;
            font-size: 0;
            transition: all 0.3s ease;
            display: block;
        }

        .slick-carousel-services .slick-dots li button::before {
            display: none !important;
        }

        .slick-carousel-services .slick-dots li button:hover {
            background-color: #0890b236;
            transform: scale(1.2);
        }

        .slick-carousel-services .slick-dots li.slick-active button {
            background-color: #0891b2;
            width: 12px;
            height: 12px;
        }

        /* Read More Button Styling */
        .read-more-btn {
            background: none;
            border: none;
            color: #54aebcff;
            padding: 0;
            cursor: pointer;
            font-weight: 600;
            font-size: 0.9rem;
            margin-top: 8px;
            transition: color 0.3s ease;
        }

        .read-more-btn:hover {
            color: #2c8c9bff;
            text-decoration: underline;
        }

        .service-card-description {
            max-height: 100px;
            overflow: hidden;
            transition: max-height 0.3s ease;
            font-size: 0.9rem;
            line-height: 1.6;
            color: #666;
            margin: 0;
            flex-grow: 1;
        }

        .service-card-description a {
            color: #54aebcff;
            text-decoration: none;
            font-weight: 600;
            transition: color 0.3s ease;
        }

        .service-card-description a:hover {
            color: #2c8c9bff;
            text-decoration: underline;
        }

        .service-card-description.expanded {
            max-height: none;
        }

        @media (max-width: 1024px) {
            .services-section-wrapper {
                grid-template-columns: 1fr;
                gap: 30px;
            }

            .services-title {
                font-size: 2.5rem;
            }

            .slick-carousel-services .slick-prev {
                right: 54px;
            }

            .slick-carousel-services .slick-next {
                right: 0;
            }

            .service-card-image {
                height: 240px; 
            }
        }

        /* Registration Section Styling */
        .registration-section {
            background: linear-gradient(to right, #14b8a6, #0891b2);
            padding: 65px 0;
            margin: 80px 0 0 0 !important;
        }

        .registration-content {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
        }

        .registration-content .fs-1 {
            font-size: 2.5rem !important;
            font-weight: 700;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        /* Custom Registration Button Styling */
        .registration-content .btn {
            background: linear-gradient(135deg, #ffffff 0%, #f0f8ff 100%);
            color: #0099CC;
            border: 2px solid #ffffff;
            padding: 12px 48px;
            font-weight: 700;
            font-size: 1.1rem;
            border-radius: 50px;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
            position: relative;
            overflow: hidden;
        }

        .registration-content .btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
            transition: left 0.6s ease;
        }

        .registration-content .btn:hover {
            background: linear-gradient(135deg, #00929c 0%, #125855 100%);
            color: #ffffff;
            transform: translateY(-3px) scale(1.05);
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
            letter-spacing: 0.5px;
            border-color: #0055AA;
        }

        .registration-content .btn:hover::before {
            left: 100%;
        }

        .registration-content .btn:active {
            transform: translateY(-1px) scale(1.02);
        }

        @media (max-width: 576px) {
            .registration-section {
                padding: 40px 20px;
            }

            .registration-content .fs-1 {
                font-size: 1.8rem !important;
            }

            .registration-content .btn {
                padding: 10px 40px;
                font-size: 1rem;
            }

            .registration-content img {
                width: 150px !important;
            }
        }
            .services-section-wrapper {
                gap: 30px;
            }

            .services-title {
                font-size: 3rem;
                margin-bottom: 12px;
            }

            .services-description {
                font-size: 1.1rem;
            }

            .service-card-content {
                padding: 16px;
                gap: 8px;
            }

            .service-card-title {
                font-size: 1.8rem;
            }

            .service-card-description {
                font-size: 0.85rem;
            }

            .slick-carousel-services .slick-prev:before,
            .slick-carousel-services .slick-next:before {
                font-size: 20px;
            }
        }
    </style>
@endpush

@section('content')
    <nav class="navbar shadow fixed-top navbar-expand-lg navbar-light d-flex justify-content-center">
        <div class="container-fluid w-100 section-wrapper m-0 p-0">
            <a
                class="navbar-brand logo-bg"
                href="https://bbkkp.kemenperin.go.id"
            >
                <img
                    alt="Logo"
                    class="logo"
                    src="{{ asset('assets/media/logos/logo-kemenperin.png') }}"
                />
            </a>
            <button
                class="navbar-toggler me-4 py-3"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNavDropdown"
                aria-controls="navbarNavDropdown"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <i class="fa-solid fa-bars" style="font-size: 1.5rem;"></i>
            </button>
            <div
                class="collapse navbar-collapse p-4"
                id="navbarNavDropdown"
            >
                <ul class="navbar-nav fw-bold fs-1" style="gap: 0.1rem;">
                    <li class="nav-item">
                        <a
                            class="nav-link"
                            href="#our-services"
                        >
                            Layanan Kami
                        </a>
                    </li>
                    <li class="nav-item">
                        <a
                            class="nav-link"
                            href="#about-us"
                        >
                            Tentang Kami
                        </a>
                    </li>
                    <li class="nav-item">
                        <a
                            class="nav-link"
                            href="#contact-us"
                        >
                            Hubungi Kami
                        </a>
                    </li>
                    <li class="nav-item">
                        @if(auth()->check())
                            <a class="nav-link" href="{{ auth()->user()->hasGroup(\App\Enums\SysGroup::PELANGGAN) ? url('/app/#/dashboard') : url('/app/#/admin/dashboard') }}">
                                Portal Polimer
                            </a>
                        @else
                            <a class="nav-link" href="{{ route('auth.login') }}">
                                Login
                            </a>
                        @endif
                    </li>
                </ul>
            </div>
        </div>
    </nav>
    <main class="w-100 d-flex flex-column align-items-stretch">
        <section class="w-100 p-0">
            <div class="slick-carousel-banners">
                @foreach($banners as $item)
                    <div class="w-100 position-relative banner-image-container">
                        <img
                            src="{{ $item['image_url'] }}"
                            class="banner-image-background"
                            data-parallax="true"
                        >
                        @if($item['title'] && $item['description'])
                            <div class="banner-card text-white d-flex flex-column gap-3">
                                <h3 class="display-3 fw-bold text-white">{{ $item['title'] }}</h3>
                                <p class="mb-0 fs-5">{{ $item['description'] }}</p>
                                @php
                                    $ctaText = $item['cta_text'] ?? null;
                                    $ctaUrl = $item['cta_url'] ?? null;
                                    $ctaTarget = $item['cta_target'] ?? null;
                                @endphp
                                @if(!empty($ctaText) || !empty($ctaUrl))
                                    <div class="d-flex">
                                        <a href="{{ $ctaUrl ?? '#' }}" class="banner-cta-button" target="_blank" rel="noopener noreferrer">
                                            {{ $ctaText ?? 'Pelajari Lebih Lanjut' }}
                                        </a>
                                    </div>
                                @endif
                            </div>
                        @endif
                    </div>
                @endforeach
            </div>
        </section>

        <!-- Company Overview Section -->
        <section class="company-overview-section w-100 d-flex justify-content-center">
            <div class="w-100 section-wrapper d-flex flex-column">
                <div class="company-overview-container">
                    <!-- Left Column: Logo & Description -->
                    <div class="company-overview-content">
                        <h1>{{ $companyOverview['title'] }}</h1>
                        <p>{!! $companyOverview['description'] !!}</p>
                    </div>

                    <!-- Right Column: Statistics -->
                    <div class="company-statistics">
                        @foreach($companyOverview['statistics'] as $stat)
                            <div class="statistic-item">
                                <span class="statistic-value">{{ $stat['value'] }}</span>
                                <span class="statistic-label">{{ $stat['label'] }}</span>
                            </div>
                        @endforeach
                    </div>
                </div>
            </div>
        </section>

        <section
            id='our-services'
            class="w-100 d-flex justify-content-center py-5"
        >
            <div class="w-100 section-wrapper">
                <div class="services-section-wrapper">
                    <!-- Left Column: Title & Description -->
                    <div class="services-content-left">
                        <h3 class="services-title">Layanan Kami</h3>
                        <p class="services-description">
                            JIS memiliki 13 jenis layanan jasa unggulan yang telah akreditasi dan sertifikasi untuk berbagai kebutuhan industri Anda
                        </p>
                    </div>

                    <!-- Right Column: Services Carousel -->
                    <div class="services-carousel-wrapper">
                        <div class="slick-carousel-services">
                            @foreach($services as $item)
                                <div class="service-card">
                                    <div class="service-card-image-wrapper">
                                        <img
                                            src="{{ $item['image_url'] }}"
                                            alt="{{ $item['name'] }}"
                                            class="service-card-image"
                                        >
                                        <span class="service-card-number">{{ $loop->iteration }}</span>
                                    </div>
                                    <div class="service-card-content">
                                        <h3 class="service-card-title">{{ $item['name'] }}</h3>
                                        @php
                                            $plainText = strip_tags($item['description']);
                                            $charCount = strlen($plainText);
                                        @endphp
                                        <div class="service-card-description">
                                            {!! $item['description'] !!}
                                        </div>
                                        @if($charCount > 250)
                                            <button class="read-more-btn" type="button">Baca Selengkapnya</button>
                                        @endif
                                    </div>
                                </div>
                            @endforeach
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Registration Section -->
        <section
            class="w-100 d-flex justify-content-center registration-section"
        >
            <div class="w-100 d-flex justify-content-center">
                <div class="section-wrapper d-flex justify-content-center">
                    <div class="text-center py-2 registration-content">
                        
                        <div class="fs-2 fw-bold mb-4 text-white">Ada yang bisa kami bantu? </div>
                        <img
                            alt="Logo"
                            src="{{ asset('assets/media/logos/logo-polimer.png') }}"
                            style="width: 256px;"
                            class="d-block mx-auto mb-4"
                        />
                        <p class="text-white mt-4">Daftar sekarang untuk konsultasi gratis dan solusi terbaik untukftar sekarang untuk konsultasi gratis dan solusi terbaik untuk bisnis Anda</p>
                        <br>
                        <div class="d-flex justify-content-center">
                            <a
                                href="{{ route('auth.register') }}"
                                class="btn btn-primary"
                            >
                                Daftar Sekarang
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section
            class="w-100 d-flex justify-content-center"
            style="padding: 5rem;"
        >
            <div class="w-100 section-wrapper d-flex flex-column gap-5 py-5">
                <div class="fs-1 fw-bold text-center">Mitra Kami</div>
                <div class="slick-carousel-partners">
                    @foreach($partners as $item)
                        <div class="p-4 d-flex justify-content-center align-items-center h-100">
                            <img
                                src="{{ $item['image_url'] }}"
                                class="w-50 rounded-3 mitra-logo"
                                style="object-fit: contain;"
                            >
                        </div>
                    @endforeach
                </div>
            </div>
        </section>
        
        <section
            id="about-us"
            class="w-100 d-flex justify-content-center"
            style="padding: 4rem 0;"
        >
            <div class="w-100 section-wrapper">
                <div class="w-100 row">
                    <div class="col-12 d-flex flex-column align-items-center gap-5 pb-5">
                        <div class="fs-1 fw-bold text-center">Tentang Kami</div>
                        <img
                            alt=""
                            class="w-50 w-lg-25"
                            src="{{ asset('assets/media/logos/logo-jis.png') }}"
                        />
                    </div>
                    <div class="col-12 col-lg-6 d-flex flex-column gap-5">
                        <p>{!! $aboutUs !!}</p>
                    </div>

                    <div class="col-12 col-lg-6 d-flex flex-column gap-4">
                        <div
                            class="accordion"
                            id="accordion-1"
                        >
                            @foreach($collapsible as $index => $item)
                                <div class="accordion-item mb-2 rounded-4">
                                    <h2
                                        class="accordion-header"
                                        id="heading-{{ $index }}"
                                    >
                                        <button
                                            class="accordion-button"
                                            type="button"
                                            data-bs-toggle="collapse"
                                            data-bs-target="#collapse-{{ $index }}"
                                            aria-expanded="true"
                                            aria-controls="collapse-{{ $index }}"
                                        >
                                            <div class="fs-1 fw-semibold">{{ $item['title'] }}</div>
                                        </button>
                                    </h2>
                                    <div
                                        id="collapse-{{ $index }}"
                                        class="accordion-collapse collapse {{ $item['is_default_open'] ? 'show' : '' }}"
                                        aria-labelledby="heading-{{ $index }}"
                                        data-bs-parent="#accordion-1"
                                    >
                                        <div class="accordion-body">
                                            <p class="mb-0">{!! $item['description'] !!}</p>
                                        </div>
                                    </div>
                                </div>
                            @endforeach
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section
            class="w-100 d-flex justify-content-center testimonials-section"
        >
            <div class="w-100 section-wrapper d-flex flex-column gap-5">
                <div class="testimonials-header text-center">
                    <h3 class="services-title">Ulasan dan Komentar</h3>
                    <p class="mb-0">Kepercayaan klien adalah prioritas kami. </br>Berikut pengalaman mereka bekerja dengan Jogja Industial Services</p>
                </div>
                <div class="slick-carousel-testimonials">
                    @foreach($testimonials as $index => $item)
                        @php
                            $initials = '';
                            $names = explode(' ', trim($item['title']));
                            foreach ($names as $name) {
                                $initials .= strtoupper(substr($name, 0, 1));
                            }
                            $avatarClass = 'testimonial-avatar-' . (($index % 6) + 1);
                        @endphp
                        <div class="testimonial-card">
                            <div class="testimonial-quote-icon">
                            </div>
                            <p class="testimonial-content">{{ $item['content'] }}</p>
                            <div class="testimonial-author">
                                @if(isset($item['avatar']) && !empty($item['avatar']))
                                    <img
                                        src="{{ $item['avatar'] }}"
                                        class="testimonial-avatar"
                                        alt="{{ $item['title'] }}"
                                        style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover;"
                                    >
                                @else
                                    <div class="testimonial-avatar {{ $avatarClass }}">
                                        {{ $initials }}
                                    </div>
                                @endif
                                <div class="testimonial-info">
                                    <h4>{{ $item['title'] }}</h4>
                                    <p>{{ $item['subtitle'] }}</p>
                                </div>
                            </div>
                        </div>
                    @endforeach
                </div>
            </div>
        </section>

        <section
            id="contact-us"
            class="w-100 d-flex justify-content-center text-white"
            style="padding: 2rem; background: linear-gradient(to right, #14b8a6, #0891b2);"
        >
            <div class="w-100 section-wrapper">
                <div class="w-100 row py-5">
                    <div class="col-12 col-lg-7 d-flex flex-column gap-4">
                        <div class="fs-4 fw-bold py-4">Waspadalah terhadap penipuan yang mengatasnamakan kami</div>
                        <div class="fs-1 fw-bold">Hubungi Kami</div>
                        @if(session('success'))
                            <div class="alert alert-success">{{ session('success') }}</div>
                        @endif
                        <form class="w-100 d-flex flex-column gap-5" method="post" action="{{ url()->current() }}">
                            @csrf
                            <input type="hidden" name="recaptcha" value="">
                            <div class="w-100 d-flex flex-column flex-lg-row gap-5">
                                <div class="w-100">
                                    <label for="nama" class="form-label text-white">
                                        Nama Lengkap <span class="required">*</span>
                                    </label>
                                    <input type="text" required class="form-control" id="nama"
                                           name="nama" placeholder="Masukkan Nama Lengkap"
                                           value="{{ old('nama') }}">
                                    @error('nama')
                                    <div class="text-danger fw-bold">{{ $message }}</div>
                                    @enderror
                                </div>
                                <div class="w-100">
                                    <label for="email" class="form-label text-white">
                                        Alamat Email <span class="required">*</span>
                                    </label>
                                    <input type="email" required class="form-control" id="email"
                                           name="email" placeholder="Masukkan Alamat Email"
                                           value="{{ old('email') }}">
                                    @error('email')
                                    <div class="text-danger fw-bold">{{ $message }}</div>
                                    @enderror
                                </div>
                            </div>
                            <div class="w-100 d-flex flex-column flex-lg-row gap-5">
                                <div class="w-100">
                                    <label for="instansi" class="form-label text-white">
                                        Nama Perusahaan / Instansi <span class="required">*</span>
                                    </label>
                                    <input type="text" required class="form-control" id="instansi"
                                           name="instansi" placeholder="Masukkan Nama Perusahaan / Instansi"
                                           value="{{ old('instansi') }}">
                                    @error('instansi')
                                    <div class="text-danger fw-bold">{{ $message }}</div>
                                    @enderror
                                </div>
                                <div class="w-100">
                                    <label for="telp" class="form-label text-white">
                                        Nomor Telepon <span class="required">*</span>
                                    </label>
                                    <!-- <small class="text-light d-block mb-2">Gunakan awalan 62, contoh: 628123456789</small> -->
                                    <input type="text" required class="form-control" id="telp"
                                           name="telp" placeholder="Masukkan Nomor Telepon"
                                           value="{{ old('telp') }}"
                                           inputmode="numeric">
                                    @error('telp')
                                    <div class="text-danger fw-bold">{{ $message }}</div>
                                    @enderror
                                </div>                                
                            </div>
                            <div class="w-100">
                                <label for="pesan" class="for text-whitem-label">
                                    Pesan <span class="required">*</span>
                                </label>
                                <textarea class="form-control" required id="pesan" name="pesan"
                                          placeholder="Tulis Pesan..." rows="3"
                                >{{ old('pesan') }}</textarea>
                                @error('pesan')
                                <div class="text-danger fw-bold">{{ $message }}</div>
                                @enderror
                            </div>
                            <div class="w-100 d-flex justify-content-start">
                                <button type="button" class="btn bg-tosca text-white" id="btnSubmitContactUs"
                                >Kirim
                                </button>
                            </div>
                        </form>
                    </div>
                    <div class="col-12 col-lg-5 d-flex flex-column align-items-center justify-content-center gap-5">
                        <div class="fs-2 fw-bold py-4">Lokasi Kami</div>
                        <img
                            alt=""
                            class="w-75"
                            src="{{ asset('assets/media/logos/logo-jis-white.png') }}"
                        />
                        <div class="w-100 w-lg-75 d-flex flex-column gap-3">
                            <div class="d-inline-flex gap-3">
                                <i class="fa-solid fa-location-dot pt-1 text-white"></i>
                                <div>Jl. Sokonandi No. 9 Yogyakarta, Indonesia 55166</div>
                            </div>
                            <div class="d-inline-flex gap-3">
                                <i class="fa-solid fa-phone pt-1 text-white"></i>
                                <div>+62 (274) 512-929</div>
                            </div>
                            <a
                                href="https://wa.me/628112827821"
                                target="_blank"
                                class="d-inline-flex gap-3 text-white"
                            >
                                <i class="fa-brands fa-whatsapp pt-1 text-white"></i>
                                <div>+62 811-2827-821</div>
                            </a>
                            <a
                                href="mailto:bbkkp_jogja@yahoo.com"
                                class="d-inline-flex gap-3 text-white"
                            >
                                <i class="fa-solid fa-envelope pt-1 text-white"></i>
                                <div>bbkkp_jogja@yahoo.com</div>
                            </a>
                            <a
                                href="https://bbkkp.kemenperin.go.id"
                                target="_blank"
                                class="d-inline-flex gap-3 text-white"
                            >
                                <i class="fa-solid fa-globe pt-1 text-white"></i>
                                <div>Website</div>
                            </a>
                            <div class="d-inline-flex gap-3">
                                <i class="fa-regular fa-clock pt-1 text-white"></i>
                                <div>
                                    <div>Senin - Jumat: 08:00 - 15:30</div>
                                    <div>Sabtu, Minggu: Tutup</div>
                                </div>
                            </div>
                            <div class="d-inline-flex align-items-center gap-3 pt-2">
                                @foreach($social_medias as $item)
                                    <a
                                        href="{{ $item['url'] }}"
                                        target="_blank"
                                        class="social-logo rounded-3"
                                        title="{{ $item['title'] }}"
                                    >
                                        <i class="{{ $item['icon_class'] }}"></i>
                                    </a>
                                @endforeach
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>
    <footer class="w-100 text-center py-5">
        <div class="w-100 d-flex justify-content-center align-items-center gap-5 mb-4">
            <!-- <img
                draggable="false"
                class="footer-img"
                src="{{ asset('assets/media/misc/berani-jujur-hebat.png') }}"
            />
            <img
                draggable="false"
                class="footer-img"
                src="{{ asset('assets/media/misc/no-korupsi.png') }}"
            />
            <img
                draggable="false"
                class="footer-img"
                src="{{ asset('assets/media/misc/no-gratifikasi.png') }}"
            />
            <img
                draggable="false"
                class="footer-img"
                src="{{ asset('assets/media/misc/berakhlak.png') }}"
            />
            <img
                draggable="false"
                class="footer-img"
                src="{{ asset('assets/media/misc/bangga-melayani-bangsa.png') }}"
            /> -->
        </div>
        <p class="mb-0">&copy; {{ date('Y') }} Jogja Industrial Services - BBSPJIKKP.</p>
    </footer>
@endsection

@push('scripts')
    <script src="https://www.google.com/recaptcha/api.js?render={{config('google.recaptcha.site_key')}}"></script>
    <script>
        function onDocumentReady(callback) {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', callback);
            } else {
                callback();
            }
        }

        // Global error handler to prevent uncaught errors
        window.addEventListener('error', function(event) {
            console.error('Global Error:', event.error);
            // Prevent default error handling for known errors
            if (event.error && event.error.message && event.error.message.includes('detail')) {
                event.preventDefault();
            }
        });

        onDocumentReady(function() {
            @if ($errors->any())
            // go to contact us section
            const contactSection = document.getElementById('contact-us');
            if (contactSection) {
                contactSection.scrollIntoView({behavior: 'instant'});
            }
            @endif

            // Format phone number input
            const telpInput = document.getElementById('telp');
            if (telpInput) {
                telpInput.addEventListener('input', function(e) {
                    // Remove non-numeric characters
                    let value = e.target.value.replace(/[^0-9]/g, '');
                    
                    // Auto-add 62 if starts with 0
                    if (value.startsWith('0')) {
                        value = '62' + value.substring(1);
                    }
                    
                    // Ensure it starts with 62 for Indonesian numbers
                    if (value.length > 0 && !value.startsWith('62')) {
                        value = '62' + value;
                    }
                    
                    e.target.value = value;
                });
                
                // Validation on blur to ensure format
                telpInput.addEventListener('blur', function(e) {
                    let value = e.target.value.replace(/[^0-9]/g, '');
                    
                    if (value.length > 0) {
                        // Remove duplicate 62 prefix
                        if (value.startsWith('6262')) {
                            value = '62' + value.substring(4);
                        }
                        
                        // Auto-add 62 if starts with 0 or 8
                        if (value.startsWith('0')) {
                            value = '62' + value.substring(1);
                        } else if (value.startsWith('8') && !value.startsWith('62')) {
                            value = '62' + value;
                        }
                        
                        e.target.value = value;
                    }
                });
            }

            // add event submit form using recaptcha
            const btnSubmit = document.getElementById('btnSubmitContactUs');
            const form = document.querySelector('form');
            
            if (btnSubmit && form) {
                btnSubmit.addEventListener('click', async function (e) {
                    e.preventDefault();
                    
                    // Clear previous error messages
                    function clearPreviousErrors() {
                        // Clear inline error messages under input fields
                        form.querySelectorAll('.text-danger').forEach(el => el.remove());
                        
                        // Clear alert messages
                        form.parentElement.querySelectorAll('.alert').forEach(el => el.remove());
                    }
                    
                    clearPreviousErrors();
                    
                    // disable button to prevent double submit
                    btnSubmit.setAttribute('disabled', 'disabled');
                    const originalText = btnSubmit.textContent;
                    btnSubmit.textContent = 'Mengirim...';
                    
                    try {
                        await initRecaptcha();
                        
                        // Get form data
                        const formData = new FormData(form);
                        
                        // Submit via AJAX
                        const response = await fetch(form.action, {
                            method: 'POST',
                            body: formData,
                            headers: {
                                'X-Requested-With': 'XMLHttpRequest',
                                'Accept': 'application/json'
                            }
                        });
                        
                        if (response.ok) {
                            const data = await response.json();
                            
                            // Show success message
                            const successDiv = document.createElement('div');
                            successDiv.className = 'alert alert-success alert-dismissible fade show';
                            successDiv.setAttribute('role', 'alert');
                            successDiv.innerHTML = `
                                ${data.success || 'Pesan berhasil dikirim!'}
                                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                            `;
                            
                            // Insert success message before form
                            form.parentElement.insertBefore(successDiv, form);
                            
                            // Clear form inputs
                            form.reset();
                            
                            // Scroll to success message
                            successDiv.scrollIntoView({behavior: 'smooth', block: 'center'});
                            
                            // Auto remove alert after 5 seconds
                            setTimeout(() => {
                                successDiv.remove();
                            }, 5000);
                        } else {
                            try {
                                const errorData = await response.json();
                                
                                // Show validation errors
                                if (errorData && typeof errorData === 'object' && errorData.errors && typeof errorData.errors === 'object') {
                                    Object.keys(errorData.errors).forEach(field => {
                                        const errorMessages = Array.isArray(errorData.errors[field]) 
                                            ? errorData.errors[field] 
                                            : [String(errorData.errors[field] || 'Terjadi kesalahan')];
                                        
                                        const input = form.querySelector(`[name="${field}"]`);
                                        
                                        if (input) {
                                            errorMessages.forEach(errorMsg => {
                                                const errorDiv = document.createElement('div');
                                                errorDiv.className = 'text-danger fw-bold mb-2 d-block';
                                                errorDiv.textContent = String(errorMsg || 'Terjadi kesalahan');
                                                input.parentElement.appendChild(errorDiv);
                                            });
                                        }
                                    });
                                } else if (errorData && typeof errorData === 'object') {
                                    // Generic error message for non-validation errors
                                    const errorMsg = (errorData.message || errorData.error || 'Terjadi kesalahan. Silakan coba lagi.');
                                    const errorDiv = document.createElement('div');
                                    errorDiv.className = 'alert alert-danger alert-dismissible fade show';
                                    errorDiv.setAttribute('role', 'alert');
                                    errorDiv.innerHTML = `
                                        ${String(errorMsg)}
                                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                    `;
                                    form.parentElement.insertBefore(errorDiv, form);
                                } else {
                                    // Fallback if response is not what we expect
                                    const errorDiv = document.createElement('div');
                                    errorDiv.className = 'alert alert-danger alert-dismissible fade show';
                                    errorDiv.setAttribute('role', 'alert');
                                    errorDiv.innerHTML = `
                                        Terjadi kesalahan. Silakan coba lagi.
                                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                    `;
                                    form.parentElement.insertBefore(errorDiv, form);
                                }
                            } catch (parseError) {
                                // If response is not JSON, show generic error
                                const errorDiv = document.createElement('div');
                                errorDiv.className = 'alert alert-danger alert-dismissible fade show';
                                errorDiv.setAttribute('role', 'alert');
                                errorDiv.innerHTML = `
                                    Terjadi kesalahan pada server. Silakan coba lagi.
                                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                `;
                                form.parentElement.insertBefore(errorDiv, form);
                            }
                            
                            // Scroll to error message
                            const firstError = form.parentElement.querySelector('.alert-danger, .text-danger');
                            if (firstError) {
                                firstError.scrollIntoView({behavior: 'smooth', block: 'center'});
                            }
                        }
                    } catch (error) {
                        console.error('Error:', error);
                        const errorDiv = document.createElement('div');
                        errorDiv.className = 'alert alert-danger alert-dismissible fade show';
                        errorDiv.setAttribute('role', 'alert');
                        errorDiv.innerHTML = `
                            Terjadi kesalahan jaringan. Silakan coba lagi.
                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                        `;
                        form.parentElement.insertBefore(errorDiv, form);
                    } finally {
                        // Re-enable button
                        btnSubmit.removeAttribute('disabled');
                        btnSubmit.textContent = originalText;
                    }
                });
            }
        });

        window.addEventListener("scroll", (event) => {
            const nav = document.querySelector('nav')
            const logo = document.querySelector('img.logo')
            if (this.scrollY > 200) {
                nav.classList.add('bg-light')
                logo.classList.add('scrolled')
            } else {
                nav.classList.remove('bg-light')
                logo.classList.remove('scrolled')
            }
        });
  
        const initRecaptcha = async function () {
            const token = await grecaptcha.execute("{{config('google.recaptcha.site_key')}}", {action: 'submit'});
            const recaptchaInput = document.querySelector('[name="recaptcha"]')
            if (recaptchaInput) recaptchaInput.setAttribute('value', token || '')
        };

        // Parallax effect untuk banner
        window.addEventListener('scroll', () => {
            const bannerImages = document.querySelectorAll('.banner-image-background');
            bannerImages.forEach(img => {
                const rect = img.getBoundingClientRect();
                const scrolled = window.scrollY;
                const yPos = scrolled * 1.5; // Adjust parallax speed (0.5 = slower)
                
                if (rect.top < window.innerHeight) {
                    img.style.transform = `translateY(${yPos * 0.3}px)`;
                }
            });
        });

        $(document).ready(function () {
            // Read More/Less functionality
            $(document).on('click', '.read-more-btn', function() {
                const $btn = $(this);
                const $description = $btn.prev('.service-card-description');
                const isExpanded = $description.hasClass('expanded');
                
                if (isExpanded) {
                    $description.removeClass('expanded');
                    $btn.text('Baca Selengkapnya');
                } else {
                    $description.addClass('expanded');
                    $btn.text('Tampilkan Lebih Sedikit');
                }
            });

            $('.slick-carousel-banners').on('init', function () {
                $(this).css('visibility', 'visible');
            });

            $('.slick-carousel-banners').slick({
                slidesToShow: 1,
                centerPadding: 0,
                dots: true,
                arrows: true,
                centerMode: true,
                autoplay: true,
                autoplaySpeed: 5000,
                pauseOnFocus: false,
                pauseOnHover: false,
                adaptiveHeight: true,
                                prevArrow: `
                <button type="button" class="slick-prev slick-prev-banner" aria-label="Previous">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="color: white;">
                        <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            `,
                                nextArrow: `
                <button type="button" class="slick-next slick-next-banner" aria-label="Next">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="color: white;">
                        <path d="M9 6L15 12L9 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            `
            });

            // Initialize services carousel
            $('.slick-carousel-services').slick({
                slidesToShow: 3,
                slidesToScroll: 1,
                dots: true,
                arrows: true,
                infinite: true,
                speed: 500,
                autoplay: true,
                autoplaySpeed: 4000,
                prevArrow: `
                <button type="button" class="slick-prev" aria-label="Previous">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 18L9 12L15 6" stroke="#003366" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            `,
                nextArrow: `
                <button type="button" class="slick-next" aria-label="Next">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 6L15 12L9 18" stroke="#003366" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            `,
                responsive: [
                    {
                        breakpoint: 1024,
                        settings: {
                            slidesToShow: 2,
                        }
                    },
                    {
                        breakpoint: 640,
                        settings: {
                            slidesToShow: 1,
                        }
                    }
                ]
            });

            // Fix click handling for services carousel arrows
            setTimeout(function() {
                const servicesPrevBtn = document.querySelector('.slick-carousel-services .slick-prev');
                const servicesNextBtn = document.querySelector('.slick-carousel-services .slick-next');
                
                if (servicesPrevBtn) {
                    servicesPrevBtn.style.pointerEvents = 'auto';
                    servicesPrevBtn.style.cursor = 'pointer';
                }
                if (servicesNextBtn) {
                    servicesNextBtn.style.pointerEvents = 'auto';
                    servicesNextBtn.style.cursor = 'pointer';
                }
            }, 100);

            $('.slick-carousel-partners').slick({
                slidesToShow: 6,
                centerPadding: 0,
                dots: false,
                arrows: true,
                centerMode: true,
                adaptiveHeight: true,
                responsive: [
                    {
                        breakpoint: 1330,
                        settings: {
                            slidesToShow: 3,
                            adaptiveHeight: true,
                        }
                    },
                    {
                        breakpoint: 1024,
                        settings: {
                            slidesToShow: 2,
                            adaptiveHeight: true,
                        }
                    },
                    {
                        breakpoint: 512,
                        settings: {
                            slidesToShow: 1,
                            adaptiveHeight: true,
                        }
                    }
                ]
            });

            // Initialize testimonials carousel
            $('.slick-carousel-testimonials').slick({
                slidesToShow: 3,
                slidesToScroll: 1,
                dots: false,
                arrows: true,
                infinite: true,
                speed: 500,
                autoplay: false,
                prevArrow: `
                <button type="button" class="slick-prev" aria-label="Previous">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 18L9 12L15 6" stroke="#14b8a6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            `,
                nextArrow: `
                <button type="button" class="slick-next" aria-label="Next">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 6L15 12L9 18" stroke="#14b8a6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            `,
                responsive: [
                    {
                        breakpoint: 1024,
                        settings: {
                            slidesToShow: 2,
                        }
                    },
                    {
                        breakpoint: 768,
                        settings: {
                            slidesToShow: 1,
                        }
                    }
                ]
            });

        });
    </script>

@endpush
