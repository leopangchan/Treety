package org.calpoly.gehackathon.web;

import org.calpoly.gehackathon.domain.Measurement;
import org.calpoly.gehackathon.domain.Traffic;
import org.calpoly.gehackathon.domain.Tree;
import org.calpoly.gehackathon.repositories.JpaMeasurementRepository;
import org.calpoly.gehackathon.repositories.JpaTreeRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping(value = "/tree")
public class TreeController {
    private static final Logger logger = LoggerFactory.getLogger(TreeController.class);
    private JpaTreeRepository repository;
    private JpaMeasurementRepository measurementRepository;

    @Autowired
    public TreeController(JpaTreeRepository repository, JpaMeasurementRepository measurementRepository) {
        this.measurementRepository = measurementRepository;
        this.repository = repository;
    }

    @RequestMapping(method = RequestMethod.GET)
    @ResponseBody
    public Iterable<Tree> trees() {
        return repository.findAll();
    }

    @RequestMapping(value = "/insert", method = RequestMethod.POST)
    public String insertTree() {
        //Tree t1 = new Tree("t1", "type1", 100.00, 200.00);
        //repository.save(t1);
        //return "Saved a tree = " + t1.getId();
        return "";
    }

    @RequestMapping(value = "/insertTreeClass", method = RequestMethod.POST)
    public String insertTreeClass(@RequestBody Tree tree) {
        repository.save(tree);
        return "Saved a tree = " + tree.getId();
    }

    @RequestMapping(value = "/insertTreeClasses", method = RequestMethod.POST)
    public String insertTreeClasses(@RequestBody ArrayList<Tree> trees) {
        repository.save((Iterable<Tree>) trees);
        return "Saved number of trees = " + trees.size();
    }

    /* returns tree benefit score for one tree */
    @GetMapping(value = "/benefit")
    public List<Measurement> getTreeBenefitScore(@RequestParam(value="pedId") String pedId,
                                                 @RequestParam(value="tffcId") String tffcId,
                                                 @RequestParam(value="envId") String envId) {

        return measurementRepository.getTreeBenefitScore(pedId, tffcId, envId);
        //return new ArrayList<Measurement>();
    }
}