<?php

namespace Modules\Home\View\Components;

use Illuminate\View\Component;
use Illuminate\View\View;

class Breadcrumbs extends Component
{
    /**
     * Create a new component instance.
     */
    public function __construct(
        public array $data,
    )
    {}

    /**
     * Get the view / contents that represent the component.
     */
    public function render(): View|string
    {
        return view('home::components.breadcrumbs', ['breadcrumbs' => $this->data]);
    }
}
