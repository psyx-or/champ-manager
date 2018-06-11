<?php

namespace App\Outils;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Sensio\Bundle\FrameworkExtraBundle\Request\ParamConverter\ParamConverterInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\DateTimeNormalizer;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\PropertyInfo\Extractor\ReflectionExtractor;

/**
 * Classe permettant de convertir le contenu d'une requête en objet.
 * Elle gère les relations.
 */
class CMParamConverter implements ParamConverterInterface
{
    /**
     * {@inheritdoc}
     */
    public function supports(ParamConverter $configuration)
    {
		return substr($configuration->getClass(), 0, strlen('App\\')) === 'App\\';
    }

	/**
     * {@inheritdoc}
     */
    public function apply(Request $request, ParamConverter $configuration)
    {
		$normalizer = new ObjectNormalizer(null, null, null, new ReflectionExtractor());
		$serializer = new Serializer([new DateTimeNormalizer(), $normalizer], [new JsonEncoder()]);
		$request->attributes->set($configuration->getName(), $serializer->deserialize($request->getContent(), $configuration->getClass(), 'json'));
    }
}
