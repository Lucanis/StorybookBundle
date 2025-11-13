<?php

namespace Storybook\Controller;

use Storybook\Event\GeneratePreviewEvent;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Profiler\Profiler;
use Twig\Environment;

final class StorybookPreviewController
{
    public function __construct(
        private readonly Environment $twig,
        private readonly EventDispatcherInterface $eventDispatcher,
        private readonly ?Profiler $profiler,
    ) {}

    public function __invoke(): Response
    {
        $this->eventDispatcher->dispatch(new GeneratePreviewEvent());

        if (null !== $this->profiler) {
            $this->profiler->disable();
        }

        $content = $this->twig->render('@Storybook/preview.html.twig');

        return new Response($content);
    }
}
